import React, { useState, useCallback, useMemo, JSX } from 'react';
import { Card, Tag, Typography, Tooltip, Button } from 'antd';
import {
  BorderOutlined,
  FlagTwoTone,
  GlobalOutlined,
  InfoOutlined,
  ReadFilled,
  UserOutlined,
} from '@ant-design/icons';
import styles from '../styles/NewsSnippet.module.scss';
import { IData_SnippetNews } from '../types/newsTypes';
import { ModalBox } from './ModalBox';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal, setShowModal } from '../redux/newsSlice';

const { Title, Paragraph, Text, Link } = Typography;

const NewsSnippet: React.FC<{ data: IData_SnippetNews }> = ({ data }) => {
  const [showAll, setShowAll] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showViewOriginal, setShowViewOriginal] = useState(false);
  const [byRelevance, setByRelevance] = useState(false);

  const dispatch = useDispatch();
  const openModalBox = useSelector((state: any) => state.news.modalOpen);

  const handleModalOpen = useCallback(() => {
    dispatch(setShowModal(true));
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  }, [dispatch]);

  const handleModalClose = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  const toggleShowAll = useCallback(() => setShowAll((prev) => !prev), []);
  const toggleShowMore = useCallback(() => setShowMore((prev) => !prev), []);
  const toggleRelevance = useCallback(
    () => setByRelevance((prev) => !prev),
    []
  );
  const toggleViewOriginal = useCallback(
    () => setShowViewOriginal((prev) => !prev),
    []
  );
  // количество скрытых тегов
  const hiddenTagsCount = useMemo(() => data.KW.length - 2, [data.KW]);
  // функция для подсветки слов
  const highlightText = useCallback((text: string) => {
    const regex = /<kw>(.*?)<\/kw>/g;
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      parts.push(text.slice(lastIndex, match.index));
      parts.push(
        <span key={match.index} style={{ backgroundColor: '#1B67C4' }}>
          {match[1]}
        </span>
      );
      lastIndex = regex.lastIndex;
    }

    parts.push(text.slice(lastIndex));
    return parts;
  }, []);

  // форматированная дата
  const formattedDate = useMemo(
    () =>
      new Date(data.DP).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    [data.DP]
  );
  // трвфик
  const traffic = useMemo(
    () =>
      data.TRAFFIC.map((el) => (
        <Tooltip title={el.value} key={el.value}>
          <span className={styles.trafficItem}>
            {el.value}{' '}
            <span className={styles.whiteBold}>
              {(el.count * 10).toFixed(2)}%
            </span>
          </span>
        </Tooltip>
      )),
    [data.TRAFFIC]
  );

  return (
    <Card className={styles.card} hoverable>
      <div className={styles.header}>
        {/* данные */}
        <div className={styles.leftInfo}>
          <Text type='secondary'>
            <span className={styles.whiteBold}>
              {formattedDate.split(' ')[0]}
            </span>{' '}
            {formattedDate.replace(/^\d+ /, '')}
          </Text>
          <Text type='secondary'>
            <span className={styles.whiteBold}>{data.REACH}K</span> Reach
          </Text>
          <Text type='secondary'>Top traffic: {traffic}</Text>
        </div>

        <div className={styles.sent}>
          <Tag color={data.SENT === 'positive' ? 'green' : 'red'}>
            {data.SENT}
          </Tag>
          <Tooltip title={data.AU.join(', ')}>
            <InfoOutlined />
          </Tooltip>
          <Button
            color='default'
            variant='link'
            style={{ padding: '5px' }}
            onClick={handleModalOpen}
            icon={<BorderOutlined />}
          />
        </div>
      </div>
      {/* Заголовок */}

      <Title level={3} className={styles.title} style={{ color: '#1B67C4' }}>
        {data.TI}
      </Title>

      <div className={styles.infoRow}>
        <span className={styles.infoItem}>
          <GlobalOutlined />
          <Link href={data.URL} target='_blank' rel='noopener noreferrer'>
            {data.DOM}
          </Link>
        </span>
        <span className={styles.infoItem}>
          <FlagTwoTone />
          <Text>{data.CNTR}</Text>
        </span>
        <span className={styles.infoItem}>
          <ReadFilled />
          <Text>{data.LANG}</Text>
        </span>
        <span className={styles.infoItem}>
          <UserOutlined />
          <Text>{data.AU.join(', ')}</Text>
        </span>
      </div>
      {/* блок с новостями  */}
      <Paragraph className={styles.paragraph}>
        {showMore
          ? data.AB
          : data.HIGHLIGHTS.map((el, index) => (
              <Text title={el} key={index}>
                {highlightText(el)}
              </Text>
            ))}
      </Paragraph>
      {/* {кнопка на открытие полного текста} */}
      <Button
        color='default'
        type='link'
        onClick={toggleShowMore}
        className={styles.showMoreButton}
      >
        {showMore ? 'Close' : 'Show More'}{' '}
        {!showMore && <span className={styles.triangle}></span>}
      </Button>
      {/* теги к новостям  */}
      <div className={styles.tags}>
        {data.KW.slice(0, showAll ? data.KW.length : 2).map((tag) => (
          <Tag key={tag.value}>{tag.value}</Tag>
        ))}
        {data.KW.length > 2 && (
          <Button type='link' onClick={toggleShowAll}>
            {showAll ? 'Close' : `Show All + ${hiddenTagsCount}`}
          </Button>
        )}
      </div>
      {/* дубликаты  */}
      <div className={styles.duble}>
        <Text type='secondary'>
          Duplicates:{' '}
          <span className={styles.whiteBold}>{data.DUBLICATES}</span>
        </Text>
        <Button className={styles.buttonRelevance} onClick={toggleRelevance}>
          By Relevance <span className={styles.triangleRelevance}></span>
        </Button>
        {/* кнопка byRelevance */}
        {byRelevance && (
          <>
            <div className={styles.downInfoContainer}>
              <div className={styles.downInfo}>
                <Text type='secondary'>
                  <span className={styles.whiteBold}>
                    {formattedDate.split(' ')[0]}
                  </span>{' '}
                  {formattedDate.replace(/^\d+ /, '')}
                </Text>
                <Text type='secondary'>
                  <span className={styles.whiteBold}>{data.REACH}K</span> Reach
                </Text>
                <div className={styles.rightIcons}>
                  <Tooltip title={data.AU.join(', ')}>
                    <InfoOutlined />
                  </Tooltip>
                  <Button
                    color='default'
                    variant='link'
                    style={{ padding: '5px' }}
                    onClick={handleModalOpen}
                    icon={<BorderOutlined />}
                  />
                </div>
              </div>
              <Title
                level={5}
                className={styles.downTitle}
                style={{ color: '#1B67C4' }}
              >
                {data.TI}
              </Title>
              <div className={styles.downInfo}>
                <GlobalOutlined />
                <span className={styles.infoItem}>
                  <Link
                    href={data.URL}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {data.DOM}
                  </Link>
                </span>
                <FlagTwoTone />
                <span className={styles.infoItem}>
                  <Text>{data.CNTR}</Text>
                </span>
                <UserOutlined />
                <span className={styles.infoItem}>
                  <Text>{data.AU.join(', ')}</Text>
                </span>
              </div>
            </div>
            {/* кнопка viewOriginal */}
            <Button
              block
              className={styles.viewButton}
              onClick={toggleViewOriginal}
            >
              <span className={styles.triangleDuble}></span>
              <Text>View Original</Text>
            </Button>

            {showViewOriginal && (
              <div className={styles.relevance}>
                <div className={styles.showViewOriginal}>
                  <GlobalOutlined />
                  {' '}
                  <span>
                    <Link
                      href={data.URL}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {data.DOM}
                    </Link>
                  </span>
                  <Paragraph>{data.AB}</Paragraph>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {/* модалка  */}
      <ModalBox
        loading={loading}
        open={openModalBox}
        onClose={handleModalClose}
        data={{ AB: data.AB }}
      />
    </Card>
  );
};

export default NewsSnippet;
