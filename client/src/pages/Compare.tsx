import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";

export default function Compare() {
  const [age, setAge] = useState(35);
  const [familySize, setFamilySize] = useState(1);
  const [annualVisits, setAnnualVisits] = useState(4);
  const [prescriptions, setPrescriptions] = useState(1);
  const [hasChronicCondition, setHasChronicCondition] = useState(false);

  const results = useMemo(() => {
    // Traditional insurance estimates
    const basePremium = familySize === 1 ? 7900 : familySize === 2 ? 14200 : 22000;
    const ageFactor = age < 30 ? 0.85 : age < 40 ? 1.0 : age < 50 ? 1.15 : 1.35;
    const tradPremium = Math.round(basePremium * ageFactor);
    const tradDeductible = familySize === 1 ? 1750 : 3500;
    const tradCopays = annualVisits * 40 + prescriptions * 30 * 12;
    const tradTotal = tradPremium + tradDeductible * 0.3 + tradCopays;

    // DPC + Catastrophic
    const dpcMonthly = familySize === 1 ? 85 : familySize === 2 ? 150 : 200;
    const dpcAnnual = dpcMonthly * 12;
    const catPremium = familySize === 1 ? 1800 : familySize === 2 ? 3200 : 4800;
    const catAgeFactor = age < 30 ? 0.7 : age < 40 ? 0.85 : age < 50 ? 1.0 : 1.2;
    const catTotal = Math.round(catPremium * catAgeFactor);
    const rxSavings = prescriptions * 15 * 12; // DPC often gets wholesale pricing
    const altTotal = dpcAnnual + catTotal + rxSavings;

    const savings = tradTotal - altTotal;
    const savingsPercent = Math.round((savings / tradTotal) * 100);

    return {
      tradPremium,
      tradDeductible,
      tradCopays,
      tradTotal: Math.round(tradTotal),
      dpcAnnual,
      catTotal,
      rxSavings,
      altTotal: Math.round(altTotal),
      savings: Math.round(savings),
      savingsPercent,
      fiveYearSavings: Math.round(savings * 5),
    };
  }, [age, familySize, annualVisits, prescriptions, hasChronicCondition]);

  return (
    <Layout>
      <SEOHead
        title="Healthcare Cost Calculator"
        description="Compare traditional insurance costs vs. DPC + catastrophic coverage. See the real numbers for your situation."
        url="/compare"
      />

      <section className="container py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-health mb-4">
            Interactive Tool
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-liberty mb-4 leading-[1.1]">
            Healthcare Cost Calculator
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl">
            Compare what you're paying now with what you could be paying. These
            are estimates based on national averages — your actual numbers may
            vary.
          </p>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Inputs */}
            <div className="space-y-6">
              <h2 className="font-serif text-2xl text-liberty mb-4">
                Your Situation
              </h2>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Age: {age}
                </label>
                <input
                  type="range"
                  min="18"
                  max="64"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full accent-health"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>18</span>
                  <span>64</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Coverage
                </label>
                <div className="flex gap-3">
                  {[
                    { val: 1, label: "Individual" },
                    { val: 2, label: "Couple" },
                    { val: 4, label: "Family" },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => setFamilySize(opt.val)}
                      className={`flex-1 py-2.5 text-sm font-medium rounded-md border transition-colors ${
                        familySize === opt.val
                          ? "bg-liberty text-white border-liberty"
                          : "bg-card text-foreground/60 border-border hover:border-health/30"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Doctor visits per year: {annualVisits}
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={annualVisits}
                  onChange={(e) => setAnnualVisits(Number(e.target.value))}
                  className="w-full accent-health"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Monthly prescriptions: {prescriptions}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={prescriptions}
                  onChange={(e) => setPrescriptions(Number(e.target.value))}
                  className="w-full accent-health"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="chronic"
                  checked={hasChronicCondition}
                  onChange={(e) => setHasChronicCondition(e.target.checked)}
                  className="w-4 h-4 accent-health"
                />
                <label htmlFor="chronic" className="text-sm text-foreground">
                  I have a chronic condition
                </label>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              <h2 className="font-serif text-2xl text-liberty mb-4">
                The Comparison
              </h2>

              {/* Traditional */}
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                  Traditional Insurance
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Annual premium</span>
                    <span className="font-medium">
                      ${results.tradPremium.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Deductible exposure
                    </span>
                    <span className="font-medium">
                      ${Math.round(results.tradDeductible * 0.3).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Copays & prescriptions
                    </span>
                    <span className="font-medium">
                      ${results.tradCopays.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="font-medium text-foreground">
                      Estimated annual cost
                    </span>
                    <span className="font-bold text-destructive text-lg">
                      ${results.tradTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Alternative */}
              <div className="bg-card rounded-lg p-6 border-2 border-health/30">
                <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-health mb-4">
                  DPC + Catastrophic
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      DPC membership
                    </span>
                    <span className="font-medium">
                      ${results.dpcAnnual.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Catastrophic plan
                    </span>
                    <span className="font-medium">
                      ${results.catTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Rx (wholesale pricing)
                    </span>
                    <span className="font-medium">
                      ${results.rxSavings.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="font-medium text-foreground">
                      Estimated annual cost
                    </span>
                    <span className="font-bold text-health text-lg">
                      ${results.altTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Savings */}
              {results.savings > 0 && (
                <div className="bg-health/10 rounded-lg p-6 text-center">
                  <p className="text-sm text-health font-medium mb-1">
                    Estimated Annual Savings
                  </p>
                  <p className="font-serif text-4xl text-health">
                    ${results.savings.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {results.savingsPercent}% less per year
                  </p>
                  <p className="text-xs text-muted-foreground mt-3">
                    5-year savings: ${results.fiveYearSavings.toLocaleString()}
                  </p>
                </div>
              )}

              <p className="text-xs text-muted-foreground italic">
                These are estimates based on national averages. Actual costs vary
                by location, provider, and plan. This is not financial advice.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
