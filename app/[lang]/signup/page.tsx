import { AvailableLanguages, getDictionary } from "@/src/translations";
import { IntlProvider } from "@/src/translations/provider";
import { SignupForm } from "@/src/ui/auth";
import { Container, Header } from "@/src/ui/components";
import { SubscriptionPlan } from "@/src/ui/pricing";

export type SignupPageProps = {
  params: { lang: AvailableLanguages };
  searchParams: { plan: string };
};

export default async function SignupPage({
  params: { lang },
  searchParams: { plan },
}: SignupPageProps) {
  const dict = await getDictionary(lang);

  return (
    <IntlProvider lang={lang} dict={dict}>
      <div className="min-h-screen bg-neutral-800">
        <Header lang={lang} dict={dict} />
        <Container className="flex justify-center pt-20">
          <SignupForm plan={plan as SubscriptionPlan} />
        </Container>
      </div>
    </IntlProvider>
  );
}
