import { Sparkles } from "lucide-react";
import { PageContainer } from "@/components/shell/PageContainer";

export default function InsightsPage() {
  return (
    <PageContainer>
      <section className="pt-12 pb-24">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 h-14 w-14 rounded-2xl glass flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-[#C77800]" />
          </div>
          <p className="text-[11px] text-[#86868B] uppercase tracking-[0.18em] mb-2">Coming soon</p>
          <h1 className="text-[28px] font-semibold text-[#1D1D1F] tracking-tight leading-tight">
            Insights
          </h1>
          <p className="text-sm text-[#6E6E73] mt-3 max-w-sm mx-auto text-balance">
            Fleet-wide trends, predicted failures, and lifetime cost analysis. We&apos;re building it
            next — your operations data will live here.
          </p>
        </div>
      </section>
    </PageContainer>
  );
}
