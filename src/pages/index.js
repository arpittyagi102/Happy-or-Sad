import { useEffect, useState } from "react";
import Sentiment from "sentiment";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [commentsList, setCommentsList] = useState([]);
  const [sentList,setSentiList]=useState([])
  const [result, setResult] = useState({
    positive:0,
    neutral:0,
    negative:0
  })

  async function fetchComments(videoId) {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/commentThreads?videoId=${videoId}&key=AIzaSyBcZkihhhLCLsKv2ncOic0E3_XWOx3H9Ic&part=snippet,replies&maxResults=100`
    );
    const data = await response.json();

    const comments = data.items.map(
      (item) => item.snippet.topLevelComment.snippet.textDisplay
    );

    return comments;
  }

  async function handleClick() {
    const url = new URL(inputValue);
    const { search } = url;
    const videoId = search.slice(3, 17);

    const comments = await fetchComments(videoId);
    console.log(comments.length)
    setCommentsList(comments);
  }

  useEffect(() => {
    var eksentiList=[];
    if (commentsList.length > 0) {
      for (let i = 0; i < commentsList.length; i++) {
        const sentiment = new Sentiment();
        eksentiList = [...eksentiList,sentiment.analyze(commentsList[i]).score];
      }
      setSentiList(eksentiList);
    } 
    let positive = 0;
    let neutral = 0;
    let negative = 0;
    eksentiList.forEach(element => {
      if (element > 0) {
        positive++;
      } else if (element === 0) {
        neutral++;
      } else {
        negative++;
      }
    });
    setResult({positive,neutral,negative});
  }, [commentsList]);

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24`}>
      <h1>Enter Video Link</h1>
      <textarea value={inputValue} onChange={(e) => setInputValue(e.target.value)}></textarea>
      <button onClick={handleClick}>show comments</button>

        {/* {commentsList.map((item, key) => {
          return (
            <div key={key}>
              <li>{item}</li>
              <br />
            </div>
          );
        })} */}
        {console.log(result)}
        <br></br>
        <div style={{marginTop:"20px",height:"20px",width:2*result.positive+"px",backgroundColor:"green",display:"inline-block"}}></div>
        <div style={{marginTop:"20px",height:"20px",width:2*result.neutral+"px",backgroundColor:"grey",display:"inline-block"}}></div>
        <div style={{marginTop:"20px",height:"20px",width:2*result.negative+"px",backgroundColor:"red",display:"inline-block"}}></div>
    </main>
  );
}
