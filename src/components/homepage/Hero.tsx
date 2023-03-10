import Link from "next/link";
import React from "react";
import { FiArrowRight, FiChevronRight } from "react-icons/fi";

type Props = {};

const Hero = (props: Props) => {
  const images = [
    "https://image.lexica.art/full_jpg/3a85c7fa-ea4a-4f64-8684-8d9fa12f6acb",
    "https://image.lexica.art/full_jpg/21ea90fb-f65a-40f9-ae89-ba25b9727b5b",
    "https://image.lexica.art/full_jpg/569c9407-f3d4-46e2-961f-55130e6419ae",
    "https://image.lexica.art/full_jpg/db029f70-673b-473c-b077-7b3ae61fa4b2",
    "https://image.lexica.art/full_jpg/02b39185-e223-45c7-9680-e5b9ab949e3b",
    "https://image.lexica.art/full_jpg/3d17a41c-bb51-42ee-8d12-ff66daa0c151",
    "https://image.lexica.art/full_jpg/87ea0cd5-472e-40ff-8383-6010a4be0bf9",
    "https://image.lexica.art/full_jpg/d9e87504-b235-4981-a49a-05344e719140"
  ]
  return (
    <section className="relative h-[calc(100vh-8rem)] flex items-center justify-center overflow-hidden">
      <div className="relative items-center w-full px-5 py-24 mx-auto overflow-hidden md:px-12 lg:px-16 max-w-7xl">
        <div className="grid items-start grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <div className="max-w-xl lg:p-10">
              <div>
                <p className="text-3xl font-bold tracking-tighter  text-white sm:text-6xl">
                  I am a short heading
                </p>
                <p className="max-w-xl md:text-xl mt-4 text-base tracking-tight text-gray-400">
                  Use this paragraph to share information about your company or
                  products. Make it engaging and interesting, and showcase your
                  brand{"'"}s personality. Thanks for visiting our website!
                </p>{" "}
              </div>
              <div className="flex flex-col gap-3 mt-10 sm:flex-row">
                <Link
                  href="/trade"
                  className="flex hover: gap-2 items-center bg-fuchsia-500 hover:scale-105 active:scale-100 duration-200 ease-out act font-medium text-xl group  py-4 px-8 rounded-xl"
                >
                  Trade now 
                  <FiArrowRight className="group-hover:translate-x-2 duration-200 ease-out"/>
                </Link>
                <a
                  href="#"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Learn more
                  <span aria-hidden="true">→</span>
                </a>{" "}
              </div>
            </div>

          </div>
          <div className="lg:mt-0 lg:ml-auto">
            <div className="absolute transform lg:-translate-y-1/2 lg:left-1/2 lg:top-1/2 lg:translate-x-8 sm:left-1/2 sm:top-0 sm:translate-x-8">
              <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                  <div className="h-full overflow-hidden w-44 lg:opacity-100 sm:opacity-0">
                    <img
                      alt="Lexingtøn thumbnail"
                      className="object-cover shadow-lg border-[1px] border-white/10"
                      src={images[0]}
                      decoding="async"
                      height={926}
                      loading="lazy"
                      width={428}
                    />
                  </div>
                  <div className="h-full overflow-hidden w-44">
                    <img
                      alt="Lexingtøn thumbnail"
                      className="object-cover shadow-lg border-[1px] border-white/10"
                      src={images[1]}
                      decoding="async"
                      height={926}
                      loading="lazy"
                      width={428}
                    />
                  </div>
                </div>
                <div className="grid flex-shrink-0 grid-cols-1 relative gap-y-6 lg:gap-y-8">
                  
                  <div className="bg-cyan-600/25 absolute blur-3xl top-40 left-0 z-[-1] h-56 w-56"/>
                  <div className="bg-fuchsia-600/25 absolute blur-3xl bottom-40 left-0 z-[-1] h-56 w-56"/>
                  <div className="h-full overflow-hidden w-44">
                    <img
                      alt="Lexingtøn thumbnail"
                      className="object-cover shadow-lg border-[1px] border-white/10"
                      src={images[2]}
                      decoding="async"
                      height={926}
                      loading="lazy"
                      width={428}
                    />
                  </div>
                  <div className="h-full overflow-hidden w-44">
                    <img
                      alt="Lexingtøn thumbnail"
                      className="object-cover shadow-lg border-[1px] border-white/10"
                      src={images[4]}
                      decoding="async"
                      height={926}
                      loading="lazy"
                      width={428}
                    />
                  </div>
                  <div className="h-full overflow-hidden w-44">
                    <img
                      alt="Lexingtøn thumbnail"
                      className="object-cover shadow-lg border-[1px] border-white/10"
                      src={images[5]}
                      decoding="async"
                      height={926}
                      loading="lazy"
                      width={428}
                    />
                  </div>
                </div>
                <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                  <div className="h-full overflow-hidden w-44">
                    <img
                      alt="Lexingtøn thumbnail"
                      className="object-cover shadow-lg border-[1px] border-white/10"
                      src={images[6]}
                      decoding="async"
                      height={926}
                      loading="lazy"
                      width={428}
                    />
                  </div>
                  <div className="h-full overflow-hidden w-44">
                    <img
                      alt="Lexingtøn thumbnail"
                      className="object-cover shadow-lg border-[1px] border-white/10"
                      src={images[7]}
                      decoding="async"
                      height={926}
                      loading="lazy"
                      width={428}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
