import "./splashScreen.css";
import { useEffect, useState, useRef } from "react";
import BIRDS from "vanta/dist/vanta.net.min.js";
import { Container } from "react-bootstrap";

function Home() {
  const [vantaEffect, setVantaEffect] = useState(0);
  const myRef = useRef(null);
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        BIRDS({
          el: myRef.current,
          color: "#5c0261",
          backgroundColor: "black",
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <>
      <div
        ref={myRef}
        style={{
          height: "100%",
          width: "100%",
          position: "absolute",
          top: 0,
          zIndex: -1,
        }}
      >
        <Container style={{ margin: "auto", paddingTop: 350 }}>
            <h1 style={{ color: "white", fontSize: 250, textAlign: "center" }}>
            <span className="font-link">
              The List
            </span>
              </h1>
            <div style={{ height: 10 }}></div>
            <h2
              style={{
                margin: "auto",
                textAlign: "center",
                color: "#d3d3d3",
                fontSize: 20,
              }}
            >
              Created deliciously by Max Ginsberg
            </h2>
        </Container>
      </div>
    </>
  );
}

/*
<div className="primary mb-5" style={{ height: '100%'}}> 
                <div className="container h-100 front">
                    <div className = "FrontText">
                        <h1 className="mb-3">The List</h1>
                        <p>
                            Created deliciously by Max Ginsberg
                        </p>
                </div>
                </div>
            </div>


            */

export default Home;
