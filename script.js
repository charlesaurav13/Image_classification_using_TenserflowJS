class Gallery {
    constructor(model) {
      this.model = model;
      
      this.state = {loading: false}
  
      this.img    = document.querySelector(".gallery__image")
      this.labels = document.querySelector(".gallery__labels")
      this.btns   = [...document.querySelectorAll("[data-query]")]
      
      this.loadImage  = this.loadImage.bind(this);
      this.onBtnClick = this.onBtnClick.bind(this);
      this.doAnalysis = this.doAnalysis.bind(this);
      this.btns.forEach(btn => btn.addEventListener("click", this.onBtnClick));
          
      // Auto-load first image
      this.btns[0].click()
    }
    
    onBtnClick(e) {
      if(this.state.loading) return
      
      const query = e.target.dataset.query;
      
      this.state.loading = true
      this.img.src = "";
      this.img.alt = `loading ${query} image from Unsplash`
      this.labels.innerHTML = "";
      
      this.loadImage(query);
      this.updateBtns(e.target)
    };
  
    async loadImage (query) {
      const res = await fetch(`https://source.unsplash.com/random/800x800/?${query}`);
      const blob = await res.blob();
      this.img.src = URL.createObjectURL(blob);
  
      // Do analysis on next tick
      setTimeout(this.doAnalysis, 100);
    }
    
    async doAnalysis() {
      const predictions = await this.model.classify(this.img);
      const getLabel = p => `Confidence ${(p.probability * 100).toFixed(2)}%: ${p.className}`
  
      this.img.alt = predictions.map(p => p.className).join(", ")
      this.labels.innerHTML = predictions.map(getLabel).join("<br>")
      this.state.loading = false;
    }
    
    updateBtns(btn) {
      const index = this.btns.indexOf(btn)
      this.btns.forEach((el, i) => {
        (i === index) ? el.classList.add("active") : el.classList.remove("active")
      })
    }
  }
  
  (async function(window){
    new Gallery(await window.mobilenet.load())
  }(this))