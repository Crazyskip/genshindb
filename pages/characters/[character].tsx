import Head from "next/head";
import { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import CharacterBanner from "../../components/CharacterBanner";
import Navbar from "../../components/Navbar";
import CharacterTalentTab from "../../components/CharacterTalentTab";
import CharacterAscensionTab from "../../components/CharacterAscensionTab";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { CharacterWithItems } from "../../common/types";

import { prisma } from "../../util/db";

type PageProps = {
  character: CharacterWithItems;
};

const CharacterPage: NextPage<PageProps> = ({ character }) => {
  const title = `${character.name} - Genshin Database`;
  const description = `Genshin Impact character ${character.name} ascension and talent requirements`;
  const keywords = `${character.name}, character, Genshin Impact, Genshin, database`;

  const [tabIndex, setTabIndex] = useState(0);
  const tabs = [
    { title: "Talents", panel: <CharacterTalentTab character={character} /> },
    {
      title: "Ascension",
      panel: <CharacterAscensionTab character={character} />,
    },
  ];

  return (
    <div>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content="Crazyskip" />
        <meta
          name="viewport"
          content="initial-scale=0.9, width=device-width, user-scalable=no"
        />
      </Head>
      <Navbar />
      <CharacterBanner character={character} />
      <Tabs
        selectedIndex={tabIndex}
        onSelect={(index) => setTabIndex(index)}
        className="mt-4 w-full md:w-10/12 lg:w-3/4 mx-auto bg-gray-900 bg-opacity-30 pb-4"
      >
        <TabList className="flex justify-center bg-gray-900 bg-opacity-90 text-gray-400 text-xl text-center">
          {tabs.map((tab, i) => (
            <Tab
              key={tab.title}
              className={`py-3 px-6 focus:outline-none cursor-pointer hover:text-gray-50 ${
                tabIndex === i ? "text-gray-50" : "text-gray-400"
              }`}
            >
              <h4>{tab.title}</h4>
            </Tab>
          ))}
        </TabList>

        {tabs.map((tab, i) => (
          <TabPanel key={i} className="focus:outline-none">
            {tab.panel}
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const character = await prisma.character.findUnique({
    where: { slug: context.params?.character as string },
    include: {
      talentBook: true,
      elementalStone: true,
      localItem: true,
      bossItem: true,
      jewel: true,
      commonItem: true,
    },
  });

  return {
    props: {
      character,
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const characterSlugs = await prisma.character.findMany({
    select: {
      slug: true,
    },
  });

  const paths = characterSlugs.map((character) => ({
    params: { character: character.slug },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export default CharacterPage;
