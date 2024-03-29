import Head from "next/head";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import { Artifact } from "@prisma/client";
import { AiFillStar } from "@react-icons/all-files/ai/AiFillStar";

import { prisma } from "../../util/db";

type Props = {
  artifact: Artifact;
};

const ArtifactPage: NextPage<Props> = ({ artifact }) => {
  const title = `${artifact.name} - Genshin Database`;
  const description = `Genshin Impact artifact set ${artifact.name} details and bonuses`;
  const keywords = `${artifact.name}, Artifact, Genshin Impact, Genshin,database`;

  const stars = [];
  for (let i = 0; i < artifact.stars; i++) {
    stars.push(<AiFillStar key={artifact.name + i} className="pr-1" />);
  }

  return (
    <div className="artifact">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content="Crazyskip" />
        <meta
          name="viewport"
          content="initial-scale=0.9, width=device-width, user-scalable=no"
        />
      </Head>
      <Navbar />
      <div className="flex items-center w-full md:w-3/4 mx-auto bg-gray-900 bg-opacity-60 mb-4">
        <div className="flex flex-col justify-center flex-1 pl-4 sm:pl-8 py-4 sm:py-6 text-gray-50">
          <h1 className="crimson-font text-3xl sm:text-4xl font-bold">
            {artifact.name.toUpperCase()}
          </h1>
          <div className="flex text-yellow-300 text-2xl sm:text-3xl">
            {stars.map((star) => star)}
          </div>
        </div>
        <div className="artifact-image relative">
          <Image
            src={`/assets/artifacts/${artifact.images[0]}`}
            alt={`Artifact ${artifact.name}`}
            layout="fill"
            objectFit="cover"
          />
        </div>
      </div>

      <div className="flex flex-wrap mx-auto w-full md:w-9/12">
        <div className="w-full lg:w-6/12 lg:pr-2 mb-4">
          <div className="text-gray-50 bg-gray-900 bg-opacity-60 p-4 flex flex-col items-center">
            <span className="text-3xl font-semibold pb-1">Pieces</span>
            <hr className="mb-4" />
            <div className="flex flex-wrap justify-center">
              {artifact.images.map((image) => {
                return (
                  <div key={image} className="artifact-item-image">
                    <Image
                      src={`/assets/artifacts/${image}`}
                      alt={`Artifact ${artifact.name}`}
                      height={128}
                      width={128}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-6/12 lg:pl-2 mb-4">
          <div className="text-gray-50 bg-gray-900 bg-opacity-60 p-4 flex flex-col items-center">
            <span className="text-3xl font-semibold pb-1">Set Bonus</span>
            <hr className="artifact-hr mb-4" />
            {artifact.bonuses.map((bonus, index) => {
              return (
                <div key={bonus}>
                  <div className="text-lg xl:text-xl text-center font-semibold leading-none">
                    {(index + 1) * 2} Pieces
                  </div>
                  <div className="text-sm xl:text-base text-center pb-4">
                    {bonus}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const artifact = await prisma.artifact.findUnique({
    where: {
      slug: context.params?.artifact as string,
    },
  });
  return {
    props: { artifact },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const artifactSlugs = await prisma.artifact.findMany({
    select: {
      slug: true,
    },
  });

  const paths = artifactSlugs.map((artifact) => ({
    params: { artifact: artifact.slug },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export default ArtifactPage;
