import type { Metadata } from "next";

import Link from "next/link";

import { getPublicData, publicMetadata } from "@/lib/queries/public";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getPublicData();

  return publicMetadata(settings, "Planos", "Planos e condições para treinar na academia.");
}

export default async function Page() {
  const { plans } = await getPublicData();

  return (
    <main className="page-hero">
      <div className="container">
        <span className="eyebrow">INVESTIMENTO</span>
        <h1>PLANOS</h1>
        <div className="grid grid-3 page-grid">
          {plans.map((plan) => (
            <article className="card" key={plan.id}>
              <span className="eyebrow">{plan.badge || plan.period}</span>
              <h2>{plan.name}</h2>
              <div className="price">
                R
                {(plan.priceCents / 100).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </div>
              <ul>
                {(plan.benefits || []).map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
              <Link className="btn" href="/#trial">
                {plan.ctaLabel || "QUERO ESTE PLANO"}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
