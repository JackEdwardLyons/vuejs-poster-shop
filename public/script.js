const PRICE    = 9.99,
      LOAD_NUM = 10;

new Vue({
  el: '#app',
  data: {
    total: 0,
    items: [],
    results: [],
    cart:  [],
    // set initial searchTerm
    searchTerm: 'climbing',
    lastSearch: '',
    loadingDone: null,
    price: PRICE
  },
  methods: {
    onSubmit () {
      if (this.searchTerm.length) {
        // reset loading signal
        this.loadingDone = false;
        this.items = [];
        // ajax get request with vue-resource
        this.$http.get(`/search/${this.searchTerm}`)
          .then(function(res) {
            // lastSearch set once submit it pressed
            // this prevents two-way binding on the frontend
            this.lastSearch  = this.searchTerm;
            this.results     = res.data;
            this.appendExtraResults();
            this.loadingDone = true;
          })
        ;
      }
    },
    addItem (index) {
      this.total += PRICE;
      let item = this.items[index];
      let addedToCart = false;
      // if item in cart
      this.cart.map((n, i) => {
        if (this.cart[i].id === item.id) {
          addedToCart = true;
          this.cart[i].qty++;
        }
      });
      // if no items in cart
      if (!addedToCart) {
        this.cart.push({
          id: item.id,
          title: item.title,
          qty: 1,
          price: PRICE
        });
      }
    },
    add (item) {
      item.qty++;
      this.total += PRICE;
    }, 
    remove (item) {
      item.qty--;
      this.total-= PRICE;

      if (item.qty <= 0) {
        this.cart.map((n, index) => {
          return (n.id === item.id) && this.cart.splice(index, 1);
        });
      }
    },
    appendExtraResults () {
      console.log('fetched new ajax results');
      if (this.items.length < this.results.length) {
        // slice x results from the main array that stores all the data
        let appendItems = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
        // the amount of items to show gets added to on scroll
        this.items = this.items.concat(appendItems);
      }
    }
  },
  computed: {
    noMoreItems () {
      return this.items.length === this.results.length && this.results.length > 0;
    }
  },
  filters: {
    currency (price) {
      return '$'.concat(Math.abs(price.toFixed(2)));
    }
  },
  // call when Vue is mounted to the DOM...
  mounted: function () {
    this.onSubmit();
    // Scroll Monitor tells us when user has scrolled to bottom of the viewport.
    // when that happens we can trigger a method to add more items to the results
    var elem    = document.querySelector('#product-list-bottom')
    var watcher = scrollMonitor.create(elem);
    watcher.enterViewport(() => {
      this.appendExtraResults();
    });
  }
});

// this is my final vue app, it is completely finished and ready to rumble.
// Here is what I learnt:

/*
- Rendering elements to screen with moustache syntax
- creating methods and using them in HTML templating
- fetching server side data with vue-resource
- Vue transitions and css rules
- Using scroll Monitor to fetch results when user scrolls
- Creating Vue filters for things like currency
- Vue LifeCycle hooks (created, mounted, etc)
*/

