import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
    FaInstagram,
    FaYoutube,
    FaTwitter,
    FaLinkedin,
    FaGithub
  } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background-color: #0d0909;
  bottom: 0;
  width: 100%;
  position: fixed;
`;

const FooterWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 1300px;
  margin: 0 auto;
  padding: 2px 14px;
`;

const SocialMedia = styled.section`
  max-width: 1300px;
  width: 100%;
`;

const SocialMediaWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1100px;
  margin: 6px auto 0 auto;
  @media screen and (max-width: 820px) {
    flex-direction: column;
  }
`;

const SocialLogo = styled(Link)`
  color: #fff;
  justify-self: start;
  cursor: pointer;
  text-decoration: none;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding-right: 2px;
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 240px;
`;

const SocialIconLink = styled.a`
  color: #fff;
  font-size: 24px;
`;
const Footer = () => {
  return (
    <FooterContainer>
      <FooterWrap>
        <SocialMedia>
          <SocialMediaWrap>
            <SocialLogo to='/'>Code-Breaker.io</SocialLogo>
            <SocialIcons>
              <SocialIconLink href='https://www.instagram.com/codebreakerinsta/' target='_blank' aria-label='Instagram'>
                <FaInstagram />
              </SocialIconLink>
              <SocialIconLink href='https://www.youtube.com/channel/UCW4QF4gHubx6VVROuacuZRw' target='_blank' aria-label='Youtube'>
                <FaYoutube />
              </SocialIconLink>
              <SocialIconLink
                href='https://twitter.com/code_breaker_io' 
                target='_blank' 
                aria-label='Twitter'>
                <FaTwitter />
              </SocialIconLink>
              <SocialIconLink href='https://www.linkedin.com/in/code-breaker-655014238/' target='_blank' aria-label='Linkedin'>
                <FaLinkedin />
              </SocialIconLink>
              <SocialIconLink href='https://github.com/fekimx/code_breaker' target='_blank' aria-label='Github'>
                <FaGithub />
              </SocialIconLink>
            </SocialIcons>
          </SocialMediaWrap>
        </SocialMedia>
      </FooterWrap>
    </FooterContainer>
  );
};

export default Footer;