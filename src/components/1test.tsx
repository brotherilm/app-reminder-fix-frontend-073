import React, { useState } from "react";

// Properti Accordion
interface AccordionProps {
  title: string;
  data: { product: string }[];
  activeIndex: number | null;
  toggleAccordion: (index: number) => void;
  index: number;
}

// Komponen Accordion tampilan
const Accordion: React.FC<AccordionProps> = ({
  title,
  data,
  activeIndex,
  toggleAccordion,
  index,
}) => (
  <div className="p-4">
    <div
      onClick={() => toggleAccordion(index)}
      className="cursor-pointer text-lg font-semibold text-orange-600 bg-orange-100 p-2 rounded-lg"
    >
      {title}
    </div>
    {activeIndex === index && (
      <div className="mt-4 p-2 border-t-2">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="text-gray-700 py-2 px-4 bg-amber-50 rounded-lg mt-2"
          >
            {item.product}
          </div>
        ))}
      </div>
    )}
  </div>
);

const Test: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const rateData_easy = [
    { product: "Product 1 (Easy)" },
    { product: "Product 2 (Easy)" },
    { product: "Product 3 (Easy)" },
  ];

  const rateData_medium = [
    { product: "Product 1 (Medium)" },
    { product: "Product 2 (Medium)" },
    { product: "Product 3 (Medium)" },
  ];

  const rateData_hard = [
    { product: "Product 1 (Hard)" },
    { product: "Product 2 (Hard)" },
    { product: "Product 3 (Hard)" },
  ];

  const rateData_extreme = [
    { product: "Product 1 (Hard)" },
    { product: "Product 2 (Hard)" },
    { product: "Product 3 (Hard)" },
  ];

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="w-full border border-black text-black">
      <div className="text-xl font-semibold p-4">Accordion Example</div>

      {/* Menggunakan komponen Accordion untuk kategori Easy, Medium, dan Hard */}
      <Accordion
        title="Easy Rates"
        data={rateData_easy}
        activeIndex={activeIndex}
        toggleAccordion={toggleAccordion}
        index={0}
      />
      <Accordion
        title="Medium Rates"
        data={rateData_medium}
        activeIndex={activeIndex}
        toggleAccordion={toggleAccordion}
        index={1}
      />
      <Accordion
        title="Hard Rates"
        data={rateData_hard}
        activeIndex={activeIndex}
        toggleAccordion={toggleAccordion}
        index={2}
      />
      <Accordion
        title="Hard Rates"
        data={rateData_extreme}
        activeIndex={activeIndex}
        toggleAccordion={toggleAccordion}
        index={3}
      />
    </div>
  );
};

export default Test;
