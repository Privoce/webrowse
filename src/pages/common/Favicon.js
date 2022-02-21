import { useState } from "react";

const Favicon = ({ url }) => {
  const [src, setSrc] = useState(url);
  const handleError = () => {
    setSrc("https://static.nicegoodthings.com/project/ext/webrowse.logo.png");
  };
  return <img onError={handleError} src={src} alt="tab favicon" />;
};

export default Favicon;
