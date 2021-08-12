const EventHandling = {
  data() {
    return {
      books: [],
      saved: [],
      query: "",
      search: false,
      pagination: {},
      currentPage: 1,
      back: false,
      totalBooks: null,
      loading: true,
      errMsg: "",
      error: false,
      sideNav: false,
      isPagniated: true,
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      await axios
        .get("https://kindlebooks.herokuapp.com/")
        .then((data) => {
          this.books = data.data.books;
          this.totalBooks = data.data.pagination.total;
          this.pagination = data.data.pagination;
        })
        .catch((err) => {
          this.error = true;
          this.errMsg = err;
        })
        .finally(() => {
          this.loading = false;
          this.back = false;
          this.query = "";
          this.search = false;
          this.currentPage = 1;
        });
      this.syncSaved();
    },
    async syncSaved() {
      if (localStorage.getItem("savedBooks")) {
        try {
          this.saved = JSON.parse(localStorage.getItem("savedBooks"));
          await this.books.map((book) => {
            this.saved.forEach((savedBook) => {
              if (book.id == savedBook.id) {
                book.isFav = true;
              }
            });
          });
          this.saved.map((book) => (book.isFav = true));
        } catch (e) {
          localStorage.removeItem("savedBooks");
        }
      }
    },
    submitForm() {
      this.loading = true;
      this.currentPage = 1;
      this.query.split(" ").join("_");
      axios
        .get(
          `https://kindlebooks.herokuapp.com/search/${this.query}/page/${this.currentPage}`
        )
        .then((data) => {
          this.books = data.data.books;
          this.pagination = data.data.pagination;
          this.totalBooks = data.data.pagination.total;
          this.search = true;
          this.syncSaved();
        })
        .catch((err) => {
          this.error = true;
          this.errMsg = err;
        })
        .finally(() => {
          this.loading = false;
          this.back = true;
        });
    },
    getPage(page = 1) {
      // const state = { "page_id": page };
      // const title = "كتب كندل";
      this.loading = true;
      const url = this.query.length
        ? `https://kindlebooks.herokuapp.com/search/${this.query}/page/${page}`
        : `https://kindlebooks.herokuapp.com/${page}`;
      // history.pushState(state, title, url);
      axios
        .get(url)
        .then((data) => {
          this.books = data.data.books;
          this.totalBooks = data.data.pagination.total;
          this.pagination = data.data.pagination;
        })
        .catch((err) => {
          this.error = true;
          this.errMsg = err;
        })
        .finally(() => {
          this.loading = false;
          this.back = true;
          this.search = false;
          this.currentPage = page;
        });
    },
    downloadBook(drive_id) {
      const data = new FormData();
      data.append("driveId", drive_id);
      axios
        .post("https://kindlebooks.herokuapp.com/download", data)
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    saveBook(book) {
      if (book.isFav) {
        this.saved = this.saved.filter((savedBook) => book.id != savedBook.id);
        this.storeSaved();
      } else {
        this.saved.push(book);
        this.storeSaved();
      }
      book.isFav = !book.isFav;
    },
    storeSaved() {
      const parsed = JSON.stringify(this.saved);
      localStorage.setItem("savedBooks", parsed);
    },
    getBookName(book) {
      return book.name
        .split(".")
        .filter(
          (mm) =>
            mm.length ==
            Math.max(...book.name.split(".").map((el) => el.length))
        )[0]
        .split("_")
        .join(" ");
    },
  },
};

Vue.createApp(EventHandling).mount("#app");