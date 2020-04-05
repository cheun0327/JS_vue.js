import "../scss/main.scss";
import "babel-polyfill";  //async await를 옛날버젼으로 해주는
import axios from "axios";

/*
Movie API

영화 리스트
https://yts.mx/api/v2/list_movies.json

영화 상세 정보
https://yts.mx/api/v2/movie_details.json?movie_id=

관련 영화 정보
https://yts.mx/api/v2/movie_suggestions.json?movie_id=
*/

/*
Youtube Link
https://www.youtube.com/watch?v=
*/

const fetchMovieList = async () => { //동기적으로 처리하겠다.
    try{
    const response = await axios //await붙인 부분만 동기적으로 처리하겠다.
    .get("https://yts.mx/api/v2/list_movies.json")//이 주소로 요청이 간다. //내가 client 주소가 server된다.

    const movieList = response.data.data.movies;

    console.log(movieList);
    }
    catch(error){
        console.log(error);
    }
}

//fetchMovieList();
//console.log(2); //2가먼저 출력됨 js의 특성때문. 비동기 통신
//console.log(movieList);


/*promise chainning */
// axios
//     .get("https://yts.mx/api/v2/list_movies.json")
//     .then((response) => {
//         console.log("movie list");
//         console.log(response);
//         const movieList = response.data.data.movies;

//         axios.get(`https://yts.mx/api/v2/movie_details.json?movie_id=${movieList[0].id}`)
//         .then((response) => {
//             console.log("movie suggestions list");
//             console.log(response);
//         })
//         .catch((error) => {
//             console.log(error);
//         })
//     })
//     .catch((error) => {
//         console.log(error);
//     });

// axios
//   .get("https://yts.mx/api/v2/list_movies.json?sort_by=rating")
//   .then((response) => {
//     console.log("movie list");
//     console.log(response);
//     const movieList = response.data.data.movies;

//     return axios.get(
//       `https://yts.mx/api/v2/movie_suggestions.json?movie_id=${movieList[0].id}`
//     );
//   })
//   .then((response) => {
//     console.log("movie suggestions list");
//     console.log(response);
//     const movies = response.data.data.movies;

//     axios
//       .get(
//         `https://yts.mx/api/v2/movie_suggestions.json?movie_id=${movies[0].id}`
//       )
//       .then((response) => {
//         console.log(response);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   })
//   .catch((error) => {
//     console.log(error);
//   });

// axios
//   .get("https://yts.mx/api/v2/list_movies.json?sort_by=rating")
//   .then((response) => {
//     console.log("movie list");
//     console.log(response);
//     const movieList = response.data.data.movies;

//     return axios.get(
//       `https://yts.mx/api/v2/movie_suggestions.json?movie_id=${movieList[0].id}`
//     );
//   })
//   .then((response) => {
//     console.log("movie suggestions list");
//     console.log(response);
//     const movies = response.data.data.movies;

//     return axios.get(
//       `https://yts.mx/api/v2/movie_suggestions.json?movie_id=${movies[0].id}`
//     );
//   })
//   .then((response) => {
//     console.log(response);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

  const fetchMovieDetail = async () => {
    try{
        const listResponse = await axios
            .get("https://yts.mx/api/v2/list_movies.json?sort_by=rating");
        
        console.log("movie list");
        const movieList = listResponse.data.data.movies;
    
        const suggestionResponse = await axios.get(
            `https://yts.mx/api/v2/movie_suggestions.json?movie_id=${movieList[0].id}`
        );

            console.log("movie suggestion");
            const movies = suggestionResponse.data.data.movies;



        const detailResponse = await axios.get(
            `https://yts.mx/api/v2/movie_details.json?movie_id=${movies[0].id}`
        );

        console.log("movie detail");
        console.log(detailResponse);
    }catch(error){
        console.log(error);
    }
  }

  //fetchMovieDetail();


  /*vue.js*/

//   const app = new Vue({ //vue객체 선언
//       el: "#app", //app이라는 id의 element에다
//       data(){
//           return{
//               message: "jasmine", 
//               className: "strong",
//               isShow: false,
//               list: [1,2,3],
//               isClicked: false,
//           }
//       },
//       computed:{
//         reversedMessage(){ //function
//             return this.message.split("").reverse().join("");
//         }
//       },
//       methods:{
//           alertMessage(){
//               alert(this.message); //this = vue 객체
//           },
//           clickBtn(){
//               this.isClicked = !this.isClicked;
//           }
//       }
//   })

//영화 소개 페이지 vue로

const app=new Vue({
    el:"#app",
    data(){
        return {
            movieList:[],
            suggestedMovies:[],
        }
    },
    async created(){ //vue객체가 생성될 때 안의 코드 실행
        const response = await axios.get("https://yts.mx/api/v2/list_movies.json?sort_by=download_count");
        this.movieList = response.data.data.movies;

        console.log(this.movieList);
    },
    methods: {
        getTrailerLink(code) {
          return `https://www.youtube.com/watch?v=${code}`;
        },
        async fetchDetails(movieId) {
          this.isDetail = false;
    
          const suggestionResponse = await axios.get(
            `https://yts.mx/api/v2/movie_suggestions.json?movie_id=${movieId}`
          );
          console.log(suggestionResponse);
          this.suggestedMovies = suggestionResponse.data.data.movies;
    
          const promises = this.suggestedMovies.map(async (movie) => {
            const detailResponse = await axios.get(
              `https://yts.mx/api/v2/movie_details.json?movie_id=${movie.id}`
            );
            movie["download_count"] = detailResponse.data.data.movie.download_count;
            console.log(detailResponse);
          });
          await Promise.all(promises);//promise객체들이 끝나는 걸 기다린다. 끝나는 순간을 포착한다.
    
          this.isDetail = true;
            //for로하면 전체가 직렬적으로 처리되는데 map사용해서 promise 객체들을 반환하고 promiseall로 하면 더 빠르다.


            // for(const movie of this.suggestedMovies){
            //     const detailResponse = axios.get(
            //         `https://yts.mx/api/v2/movie_details.json?movie_id=${movie.id}`
            //     );
            //     movie["download_count"] = detailResponse.data.data.movie.download_count;
            //     console.log(detailResponse);
            // }
            //for은 동기적으로 가져온다

        },
    },
});