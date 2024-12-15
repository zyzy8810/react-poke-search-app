import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Ensure proper import
import styled from "styled-components";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import app from "../firebase";

const initialUserData = localStorage.getItem("userData")
  ? JSON.parse(localStorage.getItem("userData"))
  : {};

const NavBar = () => {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const [show, setShow] = useState(false);
  const [userData, setUserData] = useState(initialUserData);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      } else if (user && pathname === "/login") {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [pathname]);

  // 로그인 처리 함수
  const handleAuth = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUserData(result.user);
        localStorage.setItem("userData", JSON.stringify(result.user));
        // 추가적으로 필요한 작업 처리
      })
      .catch((error) => {
        console.error("Error signing in:", error);
      });
  };

  // 스크롤 감지 함수
  const listener = () => {
    if (window.scrollY > 50) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", listener);
    return () => {
      window.removeEventListener("scroll", listener);
    };
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUserData({})
        // 추가적으로 필요한 작업 처리
        .catch((error) => {
          alert(error.message);
        });
    });
  };

  return (
    <NavWrapper show={show}>
      <Logo>
        <Image
          alt="Poke logo"
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
          onClick={() => (window.location.href = "/")}
        />
      </Logo>
      {/* 경로가 '/login'일 때만 로그인 버튼 표시 */}
      {pathname === "/login" ? (
        <Login onClick={handleAuth}>로그인</Login>
      ) : (
        <SignOut>
          <UserImg src={userData.photoURL} alt="user photo" />
          <DropDown>
            <span onClick={handleLogout}>Sign Out</span>
          </DropDown>
        </SignOut>
      )}
    </NavWrapper>
  );
};

const UserImg = styled.img`
  border-radius: 50%;
  width: 100%;
  height: 100%;
  flex-shrink: 0;
`;

const DropDown = styled.div`
  padding: 10px;
  position: absolute;
  top: 48px;
  right: 4px;
  width: 100px;
  background-color: rgb(19, 19, 19);
  border: rgba(151, 151, 151, 0.34);
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0 / 50%) 0px 0px 18px 0px;
  font-size: 14px;
  letter-spacing: 3px;
  opacity: 0;
`;

const SignOut = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 48px;
  min-width: 20px;
  padding: 10px 5px;
  cursor: pointer;
  flex-shrink: 0;
  &:hover {
    ${DropDown} {
      opacity: 1;
      transition-duration: 1s;
      color: white;
    }
  }
`;

const Login = styled.a`
  background-color: rgba(0, 0, 0, 0);
  padding: 8px 16px;
  text-transform: uppercase;
  letter-spacing: 1.55px;
  border-radius: 4px;
  transition: all 0.2s ease 0s;

  &:hover {
    background-color: #090b13;
    color: #fff;
    border-color: transparent;
  }
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  cursor: pointer;
  flex-shrink: 0;
`;

const Logo = styled.a`
  padding: 0;
  width: 50px;
  margin-top: 4px;
  flex-shrink: 0;
`;

const NavWrapper = styled.nav`
  display: flex;
  align-items: center;
  padding: 0 36px;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: ${(props) => (props.show ? "#090b13" : "transparent")};
  letter-spacing: 16px;
  z-index: 100;
  height: 70px; /* NavBar 높이 설정 */
  box-shadow: ${(props) =>
    props.show ? "0px 4px 6px rgba(0, 0, 0, 0.1)" : "none"};
  border-bottom: ${(props) =>
    props.show ? "1px solid rgba(255, 255, 255, 0.1)" : "none"};
`;

export default NavBar;
