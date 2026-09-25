-- updated_at mantido pelo banco (além do $onUpdate do Drizzle), para qualquer escrita.
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger
LANGUAGE plpgsql SET search_path = pg_catalog, public AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;
--> statement-breakpoint
DO $$
DECLARE t text;
BEGIN
  FOR t IN
    SELECT c.table_name FROM information_schema.columns c
    JOIN information_schema.tables tb ON tb.table_name = c.table_name AND tb.table_schema = c.table_schema
    WHERE c.table_schema = 'public' AND c.column_name = 'updated_at' AND tb.table_type = 'BASE TABLE'
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%1$s_updated_at ON public.%1$I', t);
    EXECUTE format('CREATE TRIGGER trg_%1$s_updated_at BEFORE UPDATE ON public.%1$I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', t);
  END LOOP;
END $$;
--> statement-breakpoint
-- Rate limit atômico (janela fixa). Retorna true se a requisição é permitida.
CREATE OR REPLACE FUNCTION public.rate_limit_hit(p_key text, p_limit int, p_window_seconds int) RETURNS boolean
LANGUAGE plpgsql SET search_path = pg_catalog, public AS $$
DECLARE v_count int;
BEGIN
  INSERT INTO public.rate_limits AS r (key, count, window_start, expires_at)
  VALUES (p_key, 1, now(), now() + make_interval(secs => p_window_seconds))
  ON CONFLICT (key) DO UPDATE SET
    count = CASE WHEN r.expires_at <= now() THEN 1 ELSE r.count + 1 END,
    window_start = CASE WHEN r.expires_at <= now() THEN now() ELSE r.window_start END,
    expires_at = CASE WHEN r.expires_at <= now() THEN now() + make_interval(secs => p_window_seconds) ELSE r.expires_at END
  RETURNING count INTO v_count;
  RETURN v_count <= p_limit;
END;
$$;
--> statement-breakpoint
-- Role da aplicação com privilégio mínimo (DML, sem DDL). Só concede se o role existir
-- (criado no Neon como "academia_app"). Migrations rodam com o role dono (neondb_owner).
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'academia_app') THEN
    EXECUTE 'REVOKE CREATE ON SCHEMA public FROM academia_app';
    EXECUTE 'GRANT USAGE ON SCHEMA public TO academia_app';
    EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO academia_app';
    EXECUTE 'GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO academia_app';
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.rate_limit_hit(text, int, int) TO academia_app';
    EXECUTE 'ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO academia_app';
    EXECUTE 'ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO academia_app';
  END IF;
END $$;
