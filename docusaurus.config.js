module.exports = {
  title: '기술블로그',
  tagline: '', // 공백으로 냅둠 제목 아래 내용을 채움
  url: 'https://docusaurus-2.netlify.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/linesong.ico',
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.
  
  
  themeConfig: {
    navbar: {
      title: '현의노래',
      logo: {
        alt: 'My Site Logo',
        src: 'img/linesong.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Documents',
          position: 'left',
        },
        //{to: 'blog', label: 'Blog', position: 'left'},
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
          title: 'Documents',
          items: [
            {
              label: 'Testing',
              to: 'docs/',
            },
            {
              label: 'Quality',
              to: 'docs/doc5',
            },
			{
              label: 'Testing Tools',
              to: 'docs/doc6',
            },
			{
              label: 'Dev',
              to: 'docs/doc4',
            },
			{
              label: 'Etc Tools',
              to: 'docs/doc2',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Team Blog',
              href: 'https://softwaretestingreference.tistory.com/',
            },
          ],
        },
        /*{
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
          ],
        },
      */],
      copyright: `Copyright © ${new Date().getFullYear()} 현의노래`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
		  // Edit 경로는 필요 없어서 주석 처리 해버림
          // Please change this to your repo.
          /*editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/',*/
			//showLastUpdateTime: true,
        },
        blog: {
          showReadingTime: true,
		  // Edit 경로는 필요 없어서 주석 처리 해버림
          // Please change this to your repo.
		  /*
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/blog/',*/
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
