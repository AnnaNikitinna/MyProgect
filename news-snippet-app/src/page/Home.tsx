import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import NewsSnippet from '../components/NewsSnippet';
import { IData_SnippetNews } from '../types/newsTypes';

const Home = () => {
  const news = useSelector((state: RootState) => state.news);

  return (
    <div style={{ padding: '24px' }}>
      {news.list.map((item: IData_SnippetNews) => (
        <NewsSnippet key={item.ID} data={item} />
      ))}
    </div>
  );
};

export default Home;