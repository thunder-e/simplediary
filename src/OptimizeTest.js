import React, { useState, useEffect } from "react";

const CounterA = React.memo(({ count }) => {
  // 리렌더링 일어났을 때
  useEffect(() => {
    console.log(`CounterA update - count : ${count}`);
  });
  return <div>{count}</div>;
});

// 여기서 React.memo를 그냥 사용하게 된다면
// 객체비교 -> 얕은 비교(객체의 주소에 대한 비교) -- 비원시타입 => count값이 바뀌진 않았지만 리렌더링
const CounterB = ({ obj }) => {
  useEffect(() => {
    console.log(`CounterB update : ${obj.count}`);
  });
  return <div>{obj.count}</div>;
};

const areEqual = (prevProps, nextProps) => {
  return prevProps.obj.count === nextProps.obj.count;
  //return true :: 이전 props = 현재 props -> 리렌더링 X
  //return false :: 이전과 현재가 다름 -> 리렌더링 !
};

const MemoizedCounterB = React.memo(CounterB, areEqual);

const OptimizeTest = () => {
  const [count, setCount] = useState(1);
  const [obj, setObj] = useState({
    count: 1,
  });

  return (
    <div style={{ padding: 50 }}>
      <div>
        <h2>Counter A</h2>
        <CounterA count={count} />
        <button onClick={() => setCount(count)}>A button</button>
      </div>
      <div>
        <h2>Counter B</h2>
        <MemoizedCounterB obj={obj} />
        <button
          onClick={() =>
            setObj({
              count: obj.count,
            })
          }
        >
          B button
        </button>
      </div>
    </div>
  );
};

export default OptimizeTest;
