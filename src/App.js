import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
//import OptimizeTest from "./OptimizeTest";
//import Lifecycle from "./Lifecycle";

function App() {
  const [data, setData] = useState([]); //[] App component, DiaryEditor 한번씩 렌더링

  const dataId = useRef(0);

  const getData = async () => {
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/comments"
    ).then((res) => res.json());

    const initData = res.slice(0, 20).map((it) => {
      return {
        author: it.email,
        content: it.body,
        emotion: Math.floor(Math.random() * 5) + 1,
        created_date: new Date().getTime(),
        id: dataId.current++,
      };
    });

    setData(initData); // dataState가 한번 더 렌더링
  };

  useEffect(() => {
    getData();
  }, []); // 빈배열 -> 콜백함수는 앱컴포넌트가 탄생(mount)되는 시점에 실행됨

  const onCreate = useCallback((author, content, emotion) => {
    //useCallback : 함수의 재생성
    const created_date = new Date().getTime();
    const newItem = {
      author,
      content,
      emotion,
      created_date,
      id: dataId.current,
    };
    dataId.current += 1;

    setData((data) => [newItem, ...data]); //함수형 업데이트 : 상태변화 함수(setState)에 함수를 전달 -> 항상 최신의 state값을 받아올 수 있음
  }, []); //onCreate에 useCallback을 사용하고 의존성 배열을 빈 값으로 두면 mount시에 한번만 실행되기 때문에 data state가 초기값인 빈 배열인 상태 => 해결위해 함수형 업데이트를 사용

  const onRemove = useCallback((targetId) => {
    setData((data) => data.filter((it) => it.id !== targetId)); // 최신 state를 이용하기 위해서는 함수형 업데이트에 인자부분과 return 부분에 data를 사용해야 한다.
  }, []);

  const onEdit = useCallback((targetId, newContent) => {
    setData((data) =>
      data.map((it) =>
        it.id === targetId ? { ...it, content: newContent } : it
      )
    );
  }, []);

  // 연산 최적화 = useMemo
  // useMemo를 사용하는 순간 함수가 아닌 getDiaryAnalysis는 값을 리턴받게 됨
  const getDiaryAnalysis = useMemo(() => {
    const goodCount = data.filter((it) => it.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100;
    return { goodCount, badCount, goodRatio };
  }, [data.length]); //데이터의 길이가 변할때만 일기분석

  const { goodCount, badCount, goodRatio } = getDiaryAnalysis; //때문에 getDiaryAnalysis()가 아닌 값 getDiaryAnalysis

  return (
    <div className="App">
      <DiaryEditor onCreate={onCreate} />
      <div>전체 일기 : {data.length}</div>
      <div>기분 좋은 일기 개수 : {goodCount}</div>
      <div>기분 나쁜 일기 개수 : {badCount}</div>
      <div>기분 좋은 일기 비율 : {goodRatio}</div>
      <DiaryList diaryList={data} onRemove={onRemove} onEdit={onEdit} />
    </div>
  );
}

export default App;
