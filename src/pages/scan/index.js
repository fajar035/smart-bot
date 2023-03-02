import React, { useEffect, useState } from "react";

function ScanBarcode() {
  const [barcode, setBarcode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCode = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`http://localhost:3000/api/wa`);
        const data = await res.json();
        setBarcode(data.src);
        setIsLoading(false);
      } catch (err) {
        console.log({ err });
      }
    };
    fetchCode();
  }, []);

  return (
    <div>
      {isLoading ? <p>Loading ..</p> : <p>Barcode</p>}
      <img src={barcode} alt="qrcode" />
    </div>
  );
}

export default ScanBarcode;
