import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";

const HERO_IMG = "https://system-free.b-cdn.net/images/hero-compare.webp";

export default function Compare() {
  const [age, setAge] = useState(35);
  const [familySize, setFamilySize] = useState(1);
  const [annualVisits, setAnnualVisits] = useState(4);
  const [prescriptions, setPrescriptions] = useState(1);
  const [hasChronicCondition, setHasChronicCondition] = useState(false);

  const results = useMemo(() => {
    const basePremium = familySize === 1 ? 7900 : familySize === 2 ? 14200 : 22000;
    const ageFactor = age < 30 ? 0.85 : age < 40 ? 1.0 : age < 50 ? 1.15 : 1.35;
    const tradPremium = Math.round(basePremium * ageFactor);
    const tradDeductible = familySize === 1 ? 1750 : 3500;
    const tradCopays = annualVisits * 40 + prescriptions * 30 * 12;
    const tradTotal = tradPremium + tradDeductible * 0.3 + tradCopays;

    const dpcMonthly = familySize === 1 ? 85 : familySize === 2 ? 150 : 200;
    const dpcAnnual = dpcMonthly * 12;
    const catPremium = familySize === 1 ? 1800 : familySize === 2 ? 3200 : 4800;
    const catAgeFactor = age < 30 ? 0.7 : age < 40 ? 0.85 : age < 50 ? 1.0 : 1.2;
    const catTotal = Math.round(catPremium * catAgeFactor);
    const rxSavings = prescriptions * 15 * 12;
    const altTotal = dpcAnnual + catTotal + rxSavings;

    const savings = tradTotal - altTotal;
    const savingsPercent = Math.round((savings / tradTotal) * 100);

    return {
      tradPremium, tradDeductible, tradCopays,
      tradTotal: Math.round(tradTotal),
      dpcAnnual, catTotal, rxSavings,
      altTotal: Math.round(altTotal),
      savings: Math.round(savings),
      savingsPercent,
      fiveYearSavings: Math.round(savings * 5),
    };
  }, [age, familySize, annualVisits, prescriptions, hasChronicCondition]);

  return (
    <Layout>
      <SEOHead
        title="Healthcare Cost Calculator — Free From the System"
        description="Compare traditional insurance costs vs. DPC + catastrophic coverage. See the real numbers for your situation."
        url="/compare"
      />

      {/* Hero */}
      <section className="page-hero min-h-[400px]">
        <img src={HERO_IMG} alt="" className="hero-bg" loading="eager" />
        <div className="container">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber mb-4 opacity-0 animate-fade-in-up">Interactive Tool</p>
            <h1 className="text-white mb-4 opacity-0 animate-fade-in-up animate-delay-100">Healthcare Cost Calculator</h1>
            <p className="text-white/70 text-lg opacity-0 animate-fade-in-up animate-delay-200">
              Compare what you are paying now with what you could be paying. See the real numbers.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12">
            {/* Inputs */}
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-health mb-2">Step 1</p>
              <h2 className="text-liberty mb-6">Your Situation</h2>
              <div className="space-y-7">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">Age: <span className="text-health">{age}</span></label>
                  <input type="range" min="18" max="64" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full accent-health h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>18</span><span>64</span></div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">Coverage</label>
                  <div className="flex gap-3">
                    {[{ val: 1, label: "Individual" }, { val: 2, label: "Couple" }, { val: 4, label: "Family" }].map((opt) => (
                      <button key={opt.val} onClick={() => setFamilySize(opt.val)}
                        className={`flex-1 py-3 text-sm font-semibold rounded-lg border-2 transition-all ${
                          familySize === opt.val ? "bg-liberty text-white border-liberty shadow-md" : "bg-card text-muted-foreground border-border hover:border-health/40"
                        }`}
                      >{opt.label}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">Doctor visits/year: <span className="text-health">{annualVisits}</span></label>
                  <input type="range" min="0" max="20" value={annualVisits} onChange={(e) => setAnnualVisits(Number(e.target.value))} className="w-full accent-health h-2" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">Monthly prescriptions: <span className="text-health">{prescriptions}</span></label>
                  <input type="range" min="0" max="10" value={prescriptions} onChange={(e) => setPrescriptions(Number(e.target.value))} className="w-full accent-health h-2" />
                </div>

                <div className="flex items-center gap-3">
                  <input type="checkbox" id="chronic" checked={hasChronicCondition} onChange={(e) => setHasChronicCondition(e.target.checked)} className="w-5 h-5 accent-health rounded" />
                  <label htmlFor="chronic" className="text-sm text-foreground font-medium">I have a chronic condition</label>
                </div>
              </div>
            </div>

            {/* Results */}
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-health mb-2">Step 2</p>
              <h2 className="text-liberty mb-6">The Comparison</h2>
              <div className="space-y-6">
                {/* Traditional */}
                <div className="rich-card p-6 border-l-4 border-l-red-400">
                  <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-4">Traditional Insurance</h3>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Annual premium</span><span className="font-semibold">${results.tradPremium.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Deductible exposure</span><span className="font-semibold">${Math.round(results.tradDeductible * 0.3).toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Copays & Rx</span><span className="font-semibold">${results.tradCopays.toLocaleString()}</span></div>
                    <div className="flex justify-between pt-3 border-t border-border"><span className="font-semibold">Estimated annual</span><span className="font-bold text-red-500 text-xl">${results.tradTotal.toLocaleString()}</span></div>
                  </div>
                </div>

                {/* Alternative */}
                <div className="rich-card p-6 border-l-4 border-l-health">
                  <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-health mb-4">DPC + Catastrophic</h3>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">DPC membership</span><span className="font-semibold">${results.dpcAnnual.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Catastrophic plan</span><span className="font-semibold">${results.catTotal.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Rx (wholesale)</span><span className="font-semibold">${results.rxSavings.toLocaleString()}</span></div>
                    <div className="flex justify-between pt-3 border-t border-border"><span className="font-semibold">Estimated annual</span><span className="font-bold text-health text-xl">${results.altTotal.toLocaleString()}</span></div>
                  </div>
                </div>

                {/* Savings */}
                {results.savings > 0 && (
                  <div className="bg-gradient-to-br from-health/10 to-health/5 rounded-xl p-8 text-center border border-health/20">
                    <p className="text-sm font-bold uppercase tracking-[0.15em] text-health mb-2">Estimated Annual Savings</p>
                    <p className="text-5xl font-bold text-health mb-1">${results.savings.toLocaleString()}</p>
                    <p className="text-muted-foreground text-sm">{results.savingsPercent}% less per year</p>
                    <div className="mt-4 pt-4 border-t border-health/15">
                      <p className="text-xs text-muted-foreground">5-year savings: <span className="font-bold text-foreground">${results.fiveYearSavings.toLocaleString()}</span></p>
                    </div>
                  </div>
                )}

                <p className="text-xs text-muted-foreground italic leading-relaxed">
                  These are estimates based on national averages. Actual costs vary by location, provider, and plan. This is not financial advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
