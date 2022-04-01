import Head from "next/head"
import Image from "next/image"
import dynamic from "next/dynamic"
import Navbar from "../../components/Navbar"

const ReactTooltip = dynamic(() => import("react-tooltip"), {
  ssr: false,
})

import { getWeapon, getAllWeaponNames } from "../../lib/weapons"
import { AiFillStar } from "@react-icons/all-files/ai/AiFillStar"
import {
  weaponItemTemplate,
  weaponLevelTemplate,
  weaponMoraTemplate,
} from "../../lib/materialTemplates"

export async function getStaticProps({ params }) {
  const weapon = await getWeapon(params.weapon)
  return {
    props: { weapon },
    revalidate: 60,
  }
}

export async function getStaticPaths() {
  const paths = await getAllWeaponNames()
  return {
    paths,
    fallback: false,
  }
}

export default function Weapon({ weapon }) {
  const stars = []
  for (let i = 0; i < weapon.stars; i++) {
    stars.push(<AiFillStar className="pr-1" />)
  }

  function getImage(itemRow) {
    if (itemRow.item === "ascensionItem1") {
      return `/assets/items/ascension/weapon1/${
        weapon.weaponPrimaryItem.items[itemRow.rarity].image
      }.webp`
    } else if (itemRow.item === "ascensionItem2") {
      return `/assets/items/ascension/weapon2/${
        weapon.weaponSecondaryItem.items[itemRow.rarity].image
      }.webp`
    } else if (itemRow.item === "common") {
      return `/assets/items/common/${
        weapon.commonItem.items[itemRow.rarity].image
      }.webp`
    }
  }

  return (
    <div className="weapon">
      <Head>
        <title>{weapon.name} - Genshin Database</title>
        <meta
          name="description"
          content={`Genshin Impact weapon ${weapon.name} ascension requirements and refinement details`}
        />
        <meta
          name="keywords"
          content={`${weapon.name}, weapon, Genshin Impact, Genshin, database`}
        />
        <meta name="author" content="Damon Jensen" />
        <meta
          name="viewport"
          content="initial-scale=0.9, width=device-width, user-scalable=no"
        />
      </Head>
      <Navbar />
      <div className="w-full md:w-9/12 mx-auto">
        <div className="flex items-center bg-gray-900 bg-opacity-60 mb-4">
          <div className="flex flex-col justify-center flex-1 pl-4 sm:pl-8  text-gray-50">
            <h1 className="crimson-font text-3xl sm:text-4xl font-bold">
              {weapon.name.toUpperCase()}
            </h1>
            <div className="flex text-yellow-300 text-2xl sm:text-3xl">
              {stars.map((star, index) => (
                <div key={index}>{star}</div>
              ))}
            </div>
          </div>
          <div className="weapon-image relative">
            <Image
              src={`/assets/weapons/${weapon.image}.webp`}
              alt={`Weapon ${weapon.name}`}
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>
        </div>
        <div className="flex flex-wrap">
          <div className="w-full lg:w-6/12 lg:pr-2 mb-4 mx-auto">
            <div className="text-gray-50 bg-gray-900 bg-opacity-60 p-4 flex flex-col items-center">
              <span className="text-3xl font-semibold pb-1">Details</span>
              <hr className="mb-4" />
              <div className="flex flex-col justify-center">
                <div>
                  <span className="font-medium">Type: </span>
                  <span className="font-light">{weapon.type}</span>
                </div>
                <div>
                  <span className="font-medium">Base ATK: </span>
                  <span className="font-light">{weapon.atk}</span>
                </div>
                <div>
                  <span className="font-medium">Secondary Stat: </span>
                  <span className="font-light">
                    {weapon.secondaryStatValue === 0
                      ? "None"
                      : `${weapon.secondaryStatValue}${weapon.secondaryStat}`}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Location: </span>
                  <span className="font-light">{weapon.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-80 mx-auto p-4 bg-gray-900 bg-opacity-70 text-gray-50 text-center">
          <h3 className="text-4xl text-gray-50 mb-1">Ascension</h3>
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              <div className="item-image relative">
                <Image
                  data-tip={JSON.stringify({
                    item: "ascensionItem1",
                    rarity: 0,
                  })}
                  data-for="ascensionItem"
                  src={`/assets/items/ascension/weapon1/${weapon.weaponPrimaryItem.items[0].image}.webp`}
                  alt={weapon.weaponPrimaryItem.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="mx-2">
                <span>{weapon.weaponPrimaryItem.days}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mx-auto text-gray-50 my-4 text-center">
          <div className="flex bg-gray-900 text-lg">
            <div className="w-2/12">Level</div>
            <div className="w-6/12 sm:w-7/12">Materials</div>
            <div className="w-4/12 sm:w-3/12">Mora Cost</div>
          </div>

          {weaponItemTemplate[weapon.stars - 1].map((template, index) => {
            return (
              <div
                key={index}
                className={`flex items-center ${
                  index % 2
                    ? "bg-gray-900 bg-opacity-90"
                    : "bg-gray-900 bg-opacity-70"
                }`}
              >
                <div className="w-2/12">
                  <span>Lvl {weaponLevelTemplate[index]}+</span>
                </div>

                <div className="w-6/12 sm:w-7/12">
                  <div className="flex flex-col justify-center sm:flex-row">
                    {template.map((rowItem) => {
                      return (
                        <div
                          key={`${rowItem.item} ${index} ${rowItem.amount}`}
                          className="flex justify-center"
                        >
                          <div className="item-image relative">
                            <Image
                              data-tip={JSON.stringify(rowItem)}
                              data-for="ascensionItem"
                              src={getImage(rowItem)}
                              alt={"weapon ascension material"}
                              width={60}
                              height={60}
                              objectFit="fixed"
                            />
                          </div>
                          <div>
                            <span className="ascension-text">
                              x{rowItem.amount}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="w-4/12 sm:w-3/12">
                  <div className="flex justify-center">
                    <div className="mora-image relative">
                      <Image
                        src="/assets/items/currency/mora.webp"
                        alt="mora"
                        width={60}
                        height={60}
                        objectFit="responsive"
                      />
                    </div>
                    <div>
                      <span className="ascension-text">
                        {weaponMoraTemplate[weapon.stars - 1][index]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="w-full lg:w-6/12 mx-auto mb-4">
          <div className="text-gray-50 bg-gray-900 bg-opacity-60 p-4 flex flex-col items-center h-full">
            <span className="text-3xl font-semibold pb-1">Refinements</span>
            <hr className="artifact-hr mb-4" />
            <div className="flex flex-col items-center">
              {weapon.refinements.map((refinement, index) => {
                return (
                  <div key={refinement} className="text-center">
                    <div className="text-xl font-semibold leading-none">
                      Level {index + 1}
                    </div>
                    <div className="pb-6 px-8 sm:px-12 md:px-4">
                      {refinement}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      <ReactTooltip
        id="ascensionItem"
        type="dark"
        effect="solid"
        getContent={(rowItemString) => {
          const rowItem = JSON.parse(rowItemString)
          if (!rowItem) return ""
          if (rowItem.item === "ascensionItem1") {
            return weapon.weaponPrimaryItem.items[rowItem.rarity].name
          } else if (rowItem.item === "ascensionItem2") {
            return weapon.weaponSecondaryItem.items[rowItem.rarity].name
          } else if (rowItem.item === "common") {
            return weapon.commonItem.items[rowItem.rarity].name
          }
        }}
      />
    </div>
  )
}
