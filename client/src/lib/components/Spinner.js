'use client'
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";



const Spinner = () => {
    const router = useRouter()
  const [count, setCount] = useState(2);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevValue) => --prevValue);
    }, 1000);

    if(count == 0){
        router.push('/')
        return () => clearInterval(interval);

    }
  }, [count]);

  return (
    <>
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>

    </>
  );
};

export default Spinner;