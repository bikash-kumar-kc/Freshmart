import { useEffect, useRef, useState } from "react";

const useDebounce = (searchTerm: string, delay: number) => {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedTerm, setDebouncedTerm] = useState("");
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, delay);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchTerm, delay]);

  return {
    debouncedTerm,
  };
};

export default useDebounce;
