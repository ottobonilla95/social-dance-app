import { AvailableLanguages, getDictionary } from "@/src/translations";
import { Footer, Header } from "@/src/ui/components";
import { Pricing } from "@/src/ui/home-page";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { lang: AvailableLanguages };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);

  return {
    title: dict.aboutUsPage.meta.title,
    description: dict.aboutUsPage.meta.description,
  };
}

export type AboutUsPageProps = {
  params: { lang: AvailableLanguages };
};
export default async function AboutUsPage({
  params: { lang },
}: AboutUsPageProps) {
  const dict = await getDictionary(lang);

  return (
    <>
      <main className="flex min-h-screen flex-col bg-neutral-800 text-neutral-100">
        <Header dict={dict} lang={lang} />
        <h2 className="text-4xl font-bold sm:pb-12 text-center pt-4 xl:pt-8">
          {dict.pricingPage.chooseYourPlan}
        </h2>
        <Pricing dict={dict} lang={lang} />
        <div className="h-10"/>
      </main>
      <Footer dict={dict} />
    </>
  );
}
