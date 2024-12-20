import { AvailableLanguages, getDictionary } from "@/src/translations";
import { Metadata } from "next";
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
import User from "@/src/data/models/user";
import City from "@/src/data/models/city";
import connectDB from "@/lib/mongodb";
import { calculateAge } from "@/src/helpers/calculate-age";
import { getZodiacSign } from "@/src/helpers/get-zodiac-sign";
import "@/src/data/models/dance-style";
import React from "react";
import { DanceStyleType } from "@/src/types";

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
  params: { lang: AvailableLanguages; profilePath: string };
};
export default async function AboutUsPage({
  params: { lang, profilePath },
}: AboutUsPageProps) {
  const dict = await getDictionary(lang);

  await connectDB();

  const userFound = await User.findOne({ profileUrl: "ottobonilla" })
    .populate("cityId", "name")
    .populate("styles.styleId", "name");

  if (!userFound) {
    return <div className="h-screen bg-black text-white">User not found</div>;
  }

  const city = await City.findById(userFound.cityId);
  const age = calculateAge(userFound?.dateOfBirth as Date);

  const zodiacSign = getZodiacSign(userFound?.dateOfBirth as Date);

  return (
    <div className="bg-black text-white">
      <div className="h-4" />
      <Container>
        {/* <div className="flex justify-end">
          <Bars3Icon className="w-7" />
        </div> */}
        <div className="h-4" />

        <div className="flex gap-4">
          <Image
            className="rounded-full w-[110px] h-[110px] object-cover"
            src={userFound?.profilePicture}
          />
          <div>
            <div className="font-bold flex text-xl">
              {userFound?.name}, {age}
            </div>
            <div className="flex gap-1">
              <MapPinIcon className="w-5" /> {city?.name}
            </div>
            <div className="flex gap-1">
              <AriesIcon className="w-5" />
              <div className="text-lg">{zodiacSign}</div>
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
        <div className="italic">{userFound?.bioDescription}</div>
        <div className="h-5" />
        <div className="">
          <div className="uppercase font-bold mb-2">My anthem</div>

          <iframe
            style={{ borderRadius: "12px" }}
            src={`https://open.spotify.com/embed/track/${userFound?.spotifySongId}?utm_source=generator&theme=0`}
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

          <div className="">
            {userFound.styles.map(({ styleId, level }) => (
              <div
                key={(styleId as DanceStyleType).name}
                className="grid grid-cols-12 gap-y-1"
              >
                <div className="text-lg font-medium col-span-6 overflow-hidden">
                  {(styleId as DanceStyleType).name}
                </div>
                <div className="flex gap-1 items-center col-span-6">
                  {Array.from({ length: level }).map((_, index) => (
                    <div className="h-6 w-3 bg-white" />
                  ))}
                </div>
              </div>
            ))}
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
