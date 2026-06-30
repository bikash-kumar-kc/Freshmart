import React from "react";

const page = async ({ params }: { params: Promise<{ cat: string }> }) => {
  const { cat } = await params;
  return <div>{cat}</div>;
};

export default page;
