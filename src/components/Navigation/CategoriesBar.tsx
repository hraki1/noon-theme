"use client";
import { getCategories } from "@/lib/axios/categoryAxios";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { organizeCategories } from "@/utils/organizeCategories";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function CategoriesBar() {
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isMouseInDropdown = useRef(false);

    const { data: categories, isLoading, error } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    // Update arrow visibility on load/resize
    useEffect(() => {
        const update = () => {
            if (scrollContainerRef.current) {
                const container = scrollContainerRef.current;
                setShowLeftArrow(container.scrollLeft > 0);
                setShowRightArrow(
                    container.scrollLeft < container.scrollWidth - container.clientWidth - 10
                );
            }
        };

        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, [categories]);

    // Handle mouse movement between category and dropdown
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!dropdownRef.current || !hoveredCategory) return;

            // Check if mouse is over dropdown
            const dropdownRect = dropdownRef.current.getBoundingClientRect();
            isMouseInDropdown.current = (
                e.clientX >= dropdownRect.left &&
                e.clientX <= dropdownRect.right &&
                e.clientY >= dropdownRect.top &&
                e.clientY <= dropdownRect.bottom
            );
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [hoveredCategory]);

    const handleCategoryHover = (categoryId: number) => {
        clearTimeout(hideTimeoutRef.current!);
        setHoveredCategory(categoryId);
        isMouseInDropdown.current = false;
    };

    const handleCategoryLeave = () => {
        hideTimeoutRef.current = setTimeout(() => {
            if (!isMouseInDropdown.current) {
                setHoveredCategory(null);
            }
        }, 150);
    };

    const handleDropdownEnter = () => {
        clearTimeout(hideTimeoutRef.current!);
        isMouseInDropdown.current = true;
    };

    const handleDropdownLeave = () => {
        setHoveredCategory(null);
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200;
            scrollContainerRef.current.scrollTo({
                left: direction === 'left'
                    ? scrollContainerRef.current.scrollLeft - scrollAmount
                    : scrollContainerRef.current.scrollLeft + scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (isLoading || error || !categories?.data) return null;

    const navCategories = categories.data.filter(cat => cat.include_in_nav);
    if (navCategories.length === 0) return null;

    const displayCategory = organizeCategories(categories.data);

    return (
        <div className="relative">
            {/* Categories Bar */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="px-2">
                    <div className="relative flex items-center">
                        {showLeftArrow && (
                            <button
                                onClick={() => scroll('left')}
                                className="absolute left-2 top-1/2 -translate-y-1/2 z-30
                                    bg-white/80 hover:bg-white/95 backdrop-blur-md border border-gray-200
                                    shadow-lg rounded-full w-10 h-10 flex items-center justify-center
                                    transition-all duration-200 hover:scale-110 hover:shadow-xl"
                                aria-label="Scroll left"
                            >
                                <FiChevronLeft className="w-6 h-6 text-[#1a7a9a]" />
                            </button>
                        )}

                        {showRightArrow && (
                            <button
                                onClick={() => scroll('right')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 z-30
                                    bg-white/80 hover:bg-white/95 backdrop-blur-md border border-gray-200
                                    shadow-lg rounded-full w-10 h-10 flex items-center justify-center
                                    transition-all duration-200 hover:scale-110 hover:shadow-xl"
                                aria-label="Scroll right"
                            >
                                <FiChevronRight className="w-6 h-6 text-[#1a7a9a]" />
                            </button>
                        )}

                        <div
                            ref={scrollContainerRef}
                            className="container mx-auto lg:px-20 flex items-center justify-start overflow-x-auto scrollbar-hide px-8"
                            onScroll={() => {
                                if (scrollContainerRef.current) {
                                    setShowLeftArrow(scrollContainerRef.current.scrollLeft > 0);
                                    setShowRightArrow(
                                        scrollContainerRef.current.scrollLeft <
                                        scrollContainerRef.current.scrollWidth -
                                        scrollContainerRef.current.clientWidth - 10
                                    );
                                }
                            }}
                        >
                            <div className="flex items-center space-x-6 md:space-x-8 lg:space-x-10 min-w-max">
                                {displayCategory.parentsWithChildren.map((category) => (
                                    <div
                                        key={category.id}
                                        className="relative"
                                        onMouseEnter={() => handleCategoryHover(category.id)}
                                        onMouseLeave={handleCategoryLeave}
                                    >
                                        <Link
                                            href={`/shopGrid?categoryid=${category.id}`}
                                            className="flex items-center whitespace-nowrap"
                                        >
                                            <span className="text-sm md:text-base font-bold py-2 text-gray-700 border-b-3 border-transparent hover:border-neutral-950">
                                                {category.description.name}
                                            </span>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dropdown */}
            <AnimatePresence>
                {hoveredCategory && (() => {
                    const category = displayCategory.parentsWithChildren.find(c => c.id === hoveredCategory);
                    return category?.children && category.children.length > 0 && (
                        <motion.div
                            ref={dropdownRef}
                            className="absolute left-0 right-0 z-40 bg-white shadow-xl border-t border-gray-200"
                            style={{
                                top: '100%',
                                minHeight: '200px'
                            }}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.15 }}
                            onMouseEnter={handleDropdownEnter}
                            onMouseLeave={handleDropdownLeave}
                        >
                            <div className="container mx-auto lg:px-20 py-6">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {category.children.map((sub) => (
                                        <Link
                                            key={sub.id}
                                            href={`/shopGrid?categoryid=${sub.id}`}
                                            className="group flex items-center gap-4 px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                                                {sub.description.image ? (
                                                    <Image
                                                        src={sub.description.image}
                                                        alt={sub.description.name}
                                                        width={48}
                                                        height={48}
                                                        className="object-cover w-full h-full"
                                                        style={{ width: "100%", height: "100%" }}
                                                    />
                                                ) : (
                                                    <span className="text-gray-400 text-xl font-bold">
                                                        {sub.description.name.charAt(0)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="font-medium text-gray-900 group-hover:text-blue-600">
                                                {sub.description.name}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    );
                })()}
            </AnimatePresence>
        </div>
    );
}