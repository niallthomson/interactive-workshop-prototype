import * as React from 'react';
import styled from '@emotion/styled';
import { StaticQuery, graphql } from 'gatsby';
import GitHubButton from 'react-github-btn';
import Link from './link';
import Loadable from 'react-loadable';

import config from '../../config.js';
import LoadingProvider from './mdxComponents/loading';
import { DarkModeSwitch } from './DarkModeSwitch';

import MarkdownMenu from './header/index'

const help = require('./images/help.svg');

const isSearchEnabled = config.header.search && config.header.search.enabled ? true : false;

let searchIndices = [];

if (isSearchEnabled && config.header.search.indexName) {
  searchIndices.push({
    name: `${config.header.search.indexName}`,
    title: `Results`,
    hitComp: `PageHit`,
  });
}

import Sidebar from './sidebar';

const LoadableComponent = Loadable({
  loader: () => import('./search/index'),
  loading: LoadingProvider,
});

function myFunction() {
  var x = document.getElementById('navbar');

  if (x.className === 'topnav') {
    x.className += ' responsive';
  } else {
    x.className = 'topnav';
  }
}

const StyledBgDiv = styled('div')`
  height: 60px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  background-color: #f8f8f8;
  position: relative;
  display: none;
  background: ${(props) => (props.isDarkThemeActive ? '#001932' : undefined)};

  @media (max-width: 767px) {
    display: block;
  }
`;

const Header = ({ location, isDarkThemeActive, toggleActiveTheme }) => (
  <StaticQuery
    query={graphql`
      query headerTitleQuery {
        site {
          siteMetadata {
            headerTitle
            githubUrl
            helpUrl
            tweetText
            logo {
              link
              image
            }
            headerLinks {
              link
              text
            }
          }
        }
        allMdx {
          edges {
            node {
              fields {
                slug
                title
              }
            }
          }
        }
      }
    `}
    render={(data) => {
      const logoImg = require('./images/logo.svg');

      const twitter = require('./images/twitter.svg');

      const discordBrandsBlock = require('./images/discord-brands-block.svg');

      const twitterBrandsBlock = require('./images/twitter-brands-block.svg');

      const {
        site: {
          siteMetadata: { headerTitle, githubUrl, helpUrl, tweetText, logo, headerLinks },
        },
        allMdx,
      } = data;

      const finalLogoLink = logo.link !== '' ? logo.link : 'https://hasura.io/';

      return (
        <div className={'navBarWrapper'}>
          <nav className={'navBarDefault'}>
            <div className={'navBarHeader'}>
              <Link to={finalLogoLink} className={'navBarBrand'}>
                <img
                  className={'img-responsive displayInline'}
                  src={logo.image !== '' ? logo.image : logoImg}
                  alt={'logo'}
                />
              </Link>
              <div
                className={'headerTitle displayInline'}
                dangerouslySetInnerHTML={{ __html: headerTitle }}
              />
            </div>
            {config.header.social ? (
              <ul
                className="socialWrapper visibleMobileView"
                dangerouslySetInnerHTML={{ __html: config.header.social }}
              ></ul>
            ) : null}
            {isSearchEnabled ? (
              <div className={'searchWrapper hiddenMobile navBarUL'}>
                <LoadableComponent collapse={true} indices={searchIndices} />
              </div>
            ) : null}
            <div id="navbar" className={'topnav'}>
              <div className={'visibleMobile'}>
                <Sidebar location={location} />
                <hr />
              </div>
              <ul className={'navBarUL navBarNav navBarULRight'}>
                <MarkdownMenu/>
                {helpUrl !== '' ? (
                  <li>
                    <a href={helpUrl}>
                      <img src={help} alt={'Help icon'} />
                    </a>
                  </li>
                ) : null}

                {tweetText !== '' ? (
                  <li>
                    <a
                      href={'https://twitter.com/intent/tweet?&text=' + tweetText}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img className={'shareIcon'} src={twitter} alt={'Twitter'} />
                    </a>
                  </li>
                ) : null}
                {tweetText !== '' || githubUrl !== '' ? (
                  <li className="divider hiddenMobile"></li>
                ) : null}
                {config.header.social ? (
                  <li className={'hiddenMobile'}>
                    <ul
                      className="socialWrapper"
                      dangerouslySetInnerHTML={{ __html: config.header.social }}
                    ></ul>
                  </li>
                ) : null}
                {githubUrl !== '' ? (
                  <li className={'githubBtn'}>
                    <GitHubButton
                      href={githubUrl}
                      data-show-count="true"
                      aria-label="Star on GitHub"
                    >
                      Star
                    </GitHubButton>
                  </li>
                ) : null}
                
              </ul>
            </div>
          </nav>
          <StyledBgDiv isDarkThemeActive={isDarkThemeActive}>
            <div className={'navBarDefault removePadd'}>
              <span
                onClick={myFunction}
                className={'navBarToggle'}
                onKeyDown={myFunction}
                role="button"
                tabIndex={0}
              >
                <span className={'iconBar'}></span>
                <span className={'iconBar'}></span>
                <span className={'iconBar'}></span>
              </span>
            </div>
            {isSearchEnabled ? (
              <div className={'searchWrapper'}>
                <LoadableComponent collapse={true} indices={searchIndices} />
              </div>
            ) : null}
          </StyledBgDiv>
        </div>
      );
    }}
  />
);

const calculateTreeData = edges => {
  const originalData = config.sidebar.ignoreIndex
    ? edges.filter(
        ({
          node: {
            fields: { slug },
          },
        }) => slug !== '/'
      )
    : edges;

  const tree = originalData.reduce(
    (
      accu,
      {
        node: {
          fields: { slug, title },
        },
      }
    ) => {
      const parts = slug.split('/');

      let { items: prevItems } = accu;

      const slicedParts =
        config.gatsby && config.gatsby.trailingSlash ? parts.slice(1, -2) : parts.slice(1, -1);

      for (const part of slicedParts) {
        let tmp = prevItems && prevItems.find(({ label }) => label == part);

        if (tmp) {
          if (!tmp.items) {
            tmp.items = [];
          }
        } else {
          tmp = { label: part, items: [] };
          prevItems.push(tmp);
        }
        prevItems = tmp.items;
      }
      const slicedLength =
        config.gatsby && config.gatsby.trailingSlash ? parts.length - 2 : parts.length - 1;

      const existingItem = prevItems.find(({ label }) => label === parts[slicedLength]);

      if (existingItem) {
        existingItem.url = slug;
        existingItem.title = title;
      } else {
        prevItems.push({
          label: parts[slicedLength],
          url: slug,
          items: [],
          title,
        });
      }
      return accu;
    },
    { items: [] }
  );

  const {
    sidebar: { forcedNavOrder = [] },
  } = config;

  const tmp = [...forcedNavOrder];

  if (config.gatsby && config.gatsby.trailingSlash) {
  }
  tmp.reverse();
  return tmp.reduce((accu, slug) => {
    const parts = slug.split('/');

    let { items: prevItems } = accu;

    const slicedParts =
      config.gatsby && config.gatsby.trailingSlash ? parts.slice(1, -2) : parts.slice(1, -1);

    for (const part of slicedParts) {
      let tmp = prevItems.find(item => item && item.label == part);

      if (tmp) {
        if (!tmp.items) {
          tmp.items = [];
        }
      } else {
        tmp = { label: part, items: [] };
        prevItems.push(tmp);
      }
      if (tmp && tmp.items) {
        prevItems = tmp.items;
      }
    }
    // sort items alphabetically.
    prevItems.map(item => {
      item.items = item.items.sort(function(a, b) {
        if(a.weight && b.weight) {
          return a.weight - b.weight
        }
        if (a.label < b.label) return -1;
        if (a.label > b.label) return 1;
        return 0;
      });
    });
    const slicedLength =
      config.gatsby && config.gatsby.trailingSlash ? parts.length - 2 : parts.length - 1;

    const index = prevItems.findIndex(({ label }) => label === parts[slicedLength]);

    if (prevItems.length) {
      accu.items.unshift(prevItems.splice(index, 1)[0]);
    }
    return accu;
  }, tree);
};

export default Header;
