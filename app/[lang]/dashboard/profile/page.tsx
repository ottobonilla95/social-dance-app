// import { auth } from "@/auth";
// import { getDBUser } from "@/src/data/user";
import { AvailableLanguages } from "@/src/translations";
import {
  AriesIcon,
  Container,
  Divider,
  Image,
  InstagramIcon,
} from "@/src/ui/components";
import {
  Bars3Icon,
  MusicalNoteIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
export type AccountPageProps = {
  params: { lang: AvailableLanguages };
};

export default async function ProfilePage({
  params: { lang },
}: AccountPageProps) {
  return (
    <div className="bg-black text-white">
      <div className="h-4" />
      <Container>
        <div className="flex justify-end">
          <Bars3Icon className="w-7" />
        </div>
        <div className="h-4" />

        <div className="flex gap-4">
          <Image
            className="rounded-full w-[110px] h-[110px] object-cover"
            src="https://womenlovetech.com/wp-content/uploads/2021/05/michael-dam-female-smiling-unsplash.jpg"
          />
          <div>
            <div className="font-bold flex text-xl">Valentina, 28</div>
            <div className="flex gap-1">
              <MapPinIcon className="w-5" /> Dublin
            </div>
            <div className="flex gap-1">
              <AriesIcon className="w-5" />
              <div className="text-lg">Aries</div>
            </div>
          </div>
        </div>

        {/* <div className="font-bold flex justify-center text-xl">
            Valentina, 28
          </div>
          <div className="h-2" />
          <div className="flex gap-1 justify-center">
            <MapPinIcon className="w-5" /> Dublin
          </div> */}
        <div className="h-4" />
        <div className="italic">
          Bachatera soul, dancing is my passion, love festivals, socials, down
          to anything..
        </div>
        <div className="h-5" />
        <div className="">
          <div className="uppercase font-bold mb-2">My anthem</div>

          <iframe
            style={{ borderRadius: "12px" }}
            src="https://open.spotify.com/embed/track/5zbqYUQ6iXb9NHSbnhxffs?utm_source=generator&theme=0"
            width="100%"
            height="152"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>
        <div className="h-5" />
        <div>
          <div className="uppercase font-bold mb-2">My styles</div>

          <div className="grid grid-cols-12 gap-y-1">
            <div className="text-lg font-medium col-span-4">Bachata</div>
            <div className="flex gap-1 items-center col-span-8">
              <div className="h-6 w-3 bg-white" />
              <div className="h-6 w-3 bg-white" />
              <div className="h-6 w-3 bg-white" />
              <div className="h-6 w-3 bg-white" />
              <div className="h-6 w-3 bg-white" />
              <div className="h-6 w-3 bg-white" />
              <div className="h-6 w-3 bg-white" />
              <div className="h-6 w-3 bg-white" />
            </div>
            <div className="text-lg font-medium col-span-4">Salsa</div>
            <div className="flex gap-1 items-center col-span-8">
              <div className="h-6 w-3 bg-white" />
              <div className="h-6 w-3 bg-white" />
              <div className="h-6 w-3 bg-white" />
              <div className="h-6 w-3 bg-white" />
            </div>
          </div>
        </div>
        <div className="h-5" />

        <div>
          <div className="uppercase font-bold mb-2">Upcoming events</div>
          <div className="flex flex-col gap-2">
            <div className="bg-gray-900 px-2 py-1 rounded">
              <div className="flex justify-between">
                <div>Dio - Bachata Social</div>
                <div>Hoy!!</div>
              </div>
              <div className="">
                <div className="flex gap-1">
                  <MapPinIcon className="w-5" /> Barcelona
                </div>
              </div>
            </div>
            <div className="bg-gray-900 px-2 py-1 rounded">
              <div className="flex justify-between">
                <div>Dio - Bachata Social</div>
                <div>Manana</div>
              </div>
              <div className="">
                <div className="flex gap-1">
                  <MapPinIcon className="w-5" /> Barcelona
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-5" />
        {/* <div className="flex gap-2">
            <AriesIcon className="w-6" />
            <div className="text-lg">Aries</div>
          </div> */}
        <div className="h-5" />
        <Divider className="border-neutral-200" />
        <div className="h-3" />
        <div className="flex justify-center">
          <InstagramIcon className="w-10" />
        </div>
      </Container>
    </div>
  );
}
