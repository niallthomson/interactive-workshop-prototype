import * as React from 'react';
import styled from '@emotion/styled';
import { MDXProvider } from '@mdx-js/react';

import ThemeProvider from './theme/themeProvider';
import mdxComponents from './mdxComponents';
import Sidebar from './sidebar';
import RightSidebar from './rightSidebar';
import config from '../../config.js';
import Loadable from 'react-loadable';
import LoadingProvider from './xterm/loading';

const Wrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.background};
  height: calc(100% - 100px);

  .sideBarUL li a {
    color: ${({ theme }) => theme.colors.text};
  }

  .sideBarUL .item > a:hover {
    background-color: #1ed3c6;
    color: #fff !important;

    /* background: #F8F8F8 */
  }

  @media only screen and (max-width: 767px) {
    display: block;
  }
`;

const Content = styled('main')`
  display: flex;
  flex-direction: column;
  //flex-grow: 1;
  margin: 0px 20px;
  padding-top: 1rem;
  width: 50%;
  max-width: 50%;
  padding-right: 15px;
  height: 100%;
  
  background: ${({ theme }) => theme.colors.background};

  table tr {
    background: ${({ theme }) => theme.colors.background};
  }

  @media only screen and (max-width: 1023px) {
    padding-left: 0;
    margin: 0 10px;
    padding-top: 3rem;
  }
`;

const MaxWidth = styled('div')`
  @media only screen and (max-width: 50rem) {
    width: 100%;
    position: relative;
  }
  height: 100%;
  width:100%;
`;

const LeftSideBarWidth = styled('div')`
  width: 200px;
`;

const RightSideBarWidth = styled('div')`
  width: 50%;
  padding-top: 30px;
`;

const Footer = styled('div')`
  position:fixed;
  bottom:0;
  left:0;
  width:100%;
  height: 90px;
  background-color: #D0DAEE;
`;

const Terminal = styled('div')`
  padding-top: 30px;
`;

const LoadableSSHTerminal = Loadable({
  loader: () => import("./xterm/sshProvider"),
  loading: LoadingProvider,
});

const Layout = ({ children, location }) => (
  <ThemeProvider location={location}>
    <MDXProvider components={mdxComponents}>
      <Wrapper>
        {config.sidebar.title ? (
          <div
            className={'sidebarTitle sideBarShow'}
            dangerouslySetInnerHTML={{ __html: config.sidebar.title }}
          />
        ) : null}
        <Content>
          {children}
        </Content>
        <RightSideBarWidth className={'hiddenMobile'}>
        <MaxWidth><LoadableSSHTerminal/></MaxWidth>
        </RightSideBarWidth>
      </Wrapper>
    </MDXProvider>
  </ThemeProvider>
);

export default Layout;
