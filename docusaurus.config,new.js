module.exports = {
  title: '기술블로그',
  tagline: '', // 공백으로 냅둠 제목 아래 내용을 채움
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/linesong.ico',
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.
  
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'dev',
        path: 'dev',
        routeBasePath: 'dev',
        sidebarPath: require.resolve('./sidebars_dev.js'),
      },
    ],

    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'testtool',
        path: 'testtool',
        routeBasePath: 'testtool',
        sidebarPath: require.resolve('./sidebars_testtool.js'),
      },
    ],

    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'testing',
        path: 'testing',
        routeBasePath: 'testing',
        sidebarPath: require.resolve('./sidebars_testing.js'),
      },
    ],

    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'quality',
        path: 'quality',
        routeBasePath: 'quality',
        sidebarPath: require.resolve('./sidebars_quality.js'),
      },
    ],

    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'etctool',
        path: 'etctool',
        routeBasePath: 'etctool',
        sidebarPath: require.resolve('./sidebars_etctool.js'),
      },
    ],
  ],
  
  
  
  themeConfig: {
    navbar: {
      title: '현의노래',
      logo: {
        alt: 'My Site Logo',
        src: 'img/linesong.svg',
      },
      items: [
	  {to: 'quality/',  label: 'quality', position: 'left'},
	  {to: 'testing/',  label: 'test', position: 'left'},
	  {to: 'testtool/',  label: 'testtool', position: 'left'},
	  {to: 'dev/',  label: 'dev', position: 'left'},
	  {to: 'etctool',  label: 'etctool', position: 'left'},
        /*{
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {to: 'blog', label: 'STEEG', position: 'left'},*/
        {
          href: 'https://softwaretestingreference.tistory.com/',
          label: 'Team Blog',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'docs',
          items: [
            {
              label: 'quality',
              to: 'quality/',
            },
            {
              label: 'test',
              to: 'testing/',
            },
			{
              label: 'testtool',
              to: 'testtool/',
            },
			{
              label: 'dev',
              to: 'dev/',
            },
			{
              label: 'etctool',
              to: 'etctool/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'SW tester cafe',
              href: 'https://cafe.naver.com/swtester',
            },
            {
              label: 'Team Blog',
              href: 'https://softwaretestingreference.tistory.com/',
            },
          ],
        },
        {
          title: 'More',
          /*items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
          ],*/
        },
		{
          title: 'Legal',
          /*items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
          ],*/
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} 현의노래`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {/*
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        },*/
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
