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
          color: "#89cff0",
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
        <Container style={{ margin: "auto", paddingTop: 300 }}>
          <div className="col-6">
            <h2 style={{ color: "#d3d3d3", fontSize: 30 }}>welcome to</h2>
            <div style={{ height: 10 }}></div>
            <h1 style={{ color: "white", fontSize: 70 }}>apollo</h1>
            <div style={{ height: 10 }}></div>
            <h2
              style={{
                margin: "auto",
                textAlign: "left",
                color: "#d3d3d3",
                fontSize: 30,
              }}
            >
              a smart assistant that helps you stay connected with your doctor.
            </h2>
          </div>
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
