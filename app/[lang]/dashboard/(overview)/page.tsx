// import { auth } from "@/auth";
import { AvailableLanguages, getDictionary } from "@/src/translations";
import ContactSchema from "@/src/data/models/contact";
import connectDB from "@/lib/mongodb";
import { ContactsMap } from "@/src/ui/dashboard";
import { Contact } from "@/src/types";

export type InsightsPageProps = {
  params: { lang: AvailableLanguages };
};

export default async function Page({ params: { lang } }: InsightsPageProps) {
  const dict = await getDictionary(lang);

  await connectDB();

  const contacts: Contact[] = await ContactSchema.find().lean();

  // const session = await auth();

  // const userId = session?.user?.id as string;

  const mapToken = process.env.MAPBOX_TOKEN;

  return (
    <main className="">
      <div className="absolute inset-0">
        <ContactsMap mapToken={mapToken || ""} contacts={contacts} />
      </div>
    </main>
  );
}
