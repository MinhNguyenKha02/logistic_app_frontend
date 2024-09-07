export const TruckItem = ({ name, originAddress, destinationAddress,driver, status="pending" }) => {
    return (
        <div className="p-4 rounded-xl bg-white shadow-md">
            <section className="flex justify-between w-full">
                <section className="flex flex-row gap-3 items-center mb-4">
                    <img className="aspect-square object-cover size-32"
                         src="https://img.freepik.com/premium-photo/large-blue-truck-with-semitrailer-template-placing-graphics-3d-rendering_101266-2347.jpg?w=1480"
                         alt=""/>
                    <section className="">
                        <h4 className="text-2xl font-bold">
                            {name} finish
                        </h4>
                        <p className="text-md font-normal">
                            {driver}asdasd
                        </p>
                    </section>
                </section>
                    <div>
                        {status==="pending" &&
                            <svg className="size-12 text-green-500 dark:text-white" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                 viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                            </svg>
                        }
                        {
                            status==="transit" &&
                            <span className="p-2 rounded-sm text-center bg-gray-300 text-black dark:text-white">
                                00&nbsp;m
                            </span>
                        }
                        {
                            status==="fail"&&
                                <svg className="size-12 text-yellow-300 dark:text-white" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                     viewBox="0 0 24 24">
                                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                    </svg>
                        }
                    </div>
            </section>
            <section className="flex gap-3 justify-center mb-4 items-center">
                <span className="text-xl font-bold">8/8</span>
                <div>
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M19 12H5m14 0-4 4m4-4-4-4"/>
                    </svg>
                </div>
                <span className="text-xl font-bold">12/12</span>
            </section>
            <section
                className="flex flex-row gap-3 items-center mb-4 border border-orange-500 text-black p-2 rounded-full">
                <div className="bg-orange-200 rounded-full p-2">
                    <svg className="size-10 text-orange-500 dark:text-white" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M4.248 19C3.22 15.77 5.275 8.232 12.466 8.232V6.079a1.025 1.025 0 0 1 1.644-.862l5.479 4.307a1.108 1.108 0 0 1 0 1.723l-5.48 4.307a1.026 1.026 0 0 1-1.643-.861v-2.154C5.275 13.616 4.248 19 4.248 19Z"/>
                    </svg>
                </div>
                <h2 className="text-left text-wrap text-md overflow-auto scrollbar text-orange-500">
                    {originAddress}289 Hai Bà Trưng, Phường 8, Quận 3, Hồ Chí Minh, Việt Nam
                </h2>
            </section>
            <section className="flex flex-row gap-3 items-center border border-gray-500 p-2 text-black rounded-full">
                <div className="bg-gray-200 rounded-full p-2">
                    <svg className="size-10 text-gray-500 dark:text-white" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M14.5 8.046H11V6.119c0-.921-.9-1.446-1.524-.894l-5.108 4.49a1.2 1.2 0 0 0 0 1.739l5.108 4.49c.624.556 1.524.027 1.524-.893v-1.928h2a3.023 3.023 0 0 1 3 3.046V19a5.593 5.593 0 0 0-1.5-10.954Z"/>
                    </svg>
                </div>
                <h2 className="text-left text-wrap text-xl">
                    {destinationAddress} sadsd
                </h2>
            </section>
        </div>
    )
}