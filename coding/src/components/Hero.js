import React from 'react';
import styled from 'styled-components';
import { MdKeyboardArrowRight } from 'react-icons/md';
import MyImage from './assets/HeroImg.png';

const Section = styled.section`
background-image: url(${MyImage});
height: 900px;
width: 100%;
display: block;
background-repeat: no-repeat;
background-size: contain;
`;
const Content = styled.div`  
width: 100%;
height: 100px;
`;
const Left = styled.div`  
padding-left: 220px;
padding-top: 143px;`
;
const Title = styled.p`
font-size: 65px;
color: #04050a;
font-weight: 400;
`;
const Desc = styled.p`
width: 472px;
font-size: 25px;
color: #9ea0ac;
line-height: 30px;
margin-top: 58px;
`;
const Button = styled.a`  
display: flex;
justify-content: center;
align-items: center;
border-radius: 18px;
margin-top: 58px;
width: 371px;
height: 71px;
line-height: 71px;
font-size: 22px;
text-align: center;
color: #fff;
cursor: pointer;
background: linear-gradient(90deg, #0546d6, #3f89fc);
text-decoration: none;
box-shadow: 0 15px 14px rgb(0 42 177 / 12%);
`;


const Hero = () => {
  return (
<Section>
      <Content>
        <Left>
          <Title>Built for Students, <br /> Learn Code Today!
          </Title>
          <Desc>
            Sharpen your programming skills with various challenges in <span> Assignments, Classes, Competitions</span>{' '}
            and more!
          </Desc>
          <Button a href='/register'  data-testid="signup-btn">
            Sign Up Today!<MdKeyboardArrowRight />
          </Button>
        </Left>
      </Content>
    </Section>
  );
};

export default Hero;
