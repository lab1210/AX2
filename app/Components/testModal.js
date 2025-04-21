import { useMediaQuery } from "react-responsive";

export default function useModalStyles() {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return {
    overlay: {
      backgroundColor: "transparent",
      zIndex: 1000,
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "transparent",
      border: "none",

      // mobile/tablet overrides:
      ...(isMobile && {
        width: "80%",
        height: "auto",
        padding: "20px",
        borderRadius: "10px",
      }),
    },
  };
}
