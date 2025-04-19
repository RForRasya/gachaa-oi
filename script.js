document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const wheel = document.getElementById("wheel")
    const spinBtn = document.getElementById("spin-btn")
    const prizeInput = document.getElementById("prize-input")
    const addPrizeBtn = document.getElementById("add-prize-btn")
    const prizeList = document.getElementById("prize-list")
    const prizeModeBtn = document.getElementById("prize-mode-btn")
    const numberModeBtn = document.getElementById("number-mode-btn")
    const prizeControls = document.getElementById("prize-controls")
    const numberControls = document.getElementById("number-controls")
    const minNumberInput = document.getElementById("min-number")
    const maxNumberInput = document.getElementById("max-number")
    const updateRangeBtn = document.getElementById("update-range-btn")
    const resultNumber = document.getElementById("result-number")
    const numberHistory = document.getElementById("number-history")
    const winnerModal = document.getElementById("winner-modal")
    const winnerDisplay = document.getElementById("winner-display")
    const winnerText = document.getElementById("winner-text")
    const closeModal = document.getElementById("close-modal")
    const confettiCanvas = document.getElementById("confetti-canvas")
  
    // Set up confetti canvas
    const ctx = confettiCanvas.getContext("2d")
    confettiCanvas.width = window.innerWidth
    confettiCanvas.height = window.innerHeight
  
    // Default prizes
    const prizes = [
      "Coral Necklace",
      "Seashell Collection",
      "Dolphin Plushie",
      "Beach Towel",
      "Snorkeling Set",
      "Ocean Painting",
      "Aquarium Tickets",
      "Mermaid Keychain",
    ]
  
    // Colors for wheel segments - ocean theme
    const colors = [
      "#006994", // Deep Ocean Blue
      "#0099cc", // Ocean Blue
      "#66cccc", // Seafoam
      "#339999", // Teal
      "#006666", // Dark Teal
      "#003366", // Navy Blue
      "#0066cc", // Azure
      "#0099ff", // Sky Blue
    ]
  
    // Variables
    let isSpinning = false
    let selectedPrize = null
    let minNumber = 1
    let maxNumber = 100
    let currentMode = "prize" // 'prize' or 'number'
    const history = []
  
    // Initialize the wheel
    function initWheel() {
      wheel.innerHTML = ""
  
      if (currentMode === "prize") {
        const segmentAngle = 360 / prizes.length
  
        prizes.forEach((prize, index) => {
          const segment = document.createElement("div")
          segment.className = "wheel-segment"
          segment.style.transform = `rotate(${index * segmentAngle}deg)`
          segment.style.backgroundColor = colors[index % colors.length]
  
          // Create text element for better positioning
          const text = document.createElement("span")
          text.textContent = prize
          text.style.transform = `rotate(${90 - segmentAngle / 2}deg)`
          text.style.transformOrigin = "center"
          text.style.width = "100px"
          text.style.display = "block"
  
          segment.appendChild(text)
          wheel.appendChild(segment)
        })
      } else {
        // Number mode - create segments with numbers 1-20 (just for visual)
        const segments = 20
        const segmentAngle = 360 / segments
  
        for (let i = 0; i < segments; i++) {
          const segment = document.createElement("div")
          segment.className = "wheel-segment"
          segment.style.transform = `rotate(${i * segmentAngle}deg)`
          segment.style.backgroundColor = colors[i % colors.length]
  
          // Create text element for better positioning
          const text = document.createElement("span")
          text.textContent = i + 1
          text.style.transform = `rotate(${90 - segmentAngle / 2}deg)`
          text.style.transformOrigin = "center"
          text.style.width = "100px"
          text.style.display = "block"
  
          segment.appendChild(text)
          wheel.appendChild(segment)
        }
      }
    }
  
    // Initialize prize list
    function initPrizeList() {
      prizeList.innerHTML = ""
      prizes.forEach((prize, index) => {
        addPrizeToList(prize, index)
      })
    }
  
    // Add prize to the list
    function addPrizeToList(prize, index) {
      const prizeItem = document.createElement("div")
      prizeItem.className = "prize-item"
      prizeItem.innerHTML = `
              <span>${prize}</span>
              <button data-index="${index}" class="delete-prize">×</button>
          `
      prizeList.appendChild(prizeItem)
  
      // Add event listener to delete button
      const deleteBtn = prizeItem.querySelector(".delete-prize")
      deleteBtn.addEventListener("click", function () {
        const index = Number.parseInt(this.getAttribute("data-index"))
        prizes.splice(index, 1)
        initWheel()
        initPrizeList()
      })
    }
  
    // Update the number range
    function updateRange() {
      let newMin = Number.parseInt(minNumberInput.value)
      let newMax = Number.parseInt(maxNumberInput.value)
  
      // Validate inputs
      if (isNaN(newMin) || isNaN(newMax)) {
        alert("Please enter valid numbers")
        return
      }
  
      if (newMin >= newMax) {
        alert("Minimum number must be less than maximum number")
        return
      }
  
      if (newMin < 1) {
        newMin = 1
        minNumberInput.value = 1
      }
  
      if (newMax > 1000) {
        newMax = 1000
        maxNumberInput.value = 1000
      }
  
      minNumber = newMin
      maxNumber = newMax
  
      // Update range text
      document.querySelector(".range-text").textContent = `Range: ${minNumber}-${maxNumber}`
    }
  
    // Spin the wheel
    function spinWheel() {
      if (isSpinning) return
  
      if (currentMode === "prize" && prizes.length < 2) {
        alert("Please add at least 2 prizes to spin the wheel")
        return
      }
  
      isSpinning = true
      spinBtn.disabled = true
      spinBtn.textContent = "SPINNING..."
  
      // Play sound effect
      const spinSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2006/2006-preview.mp3")
      spinSound.volume = 0.5
      spinSound.play()
  
      // Calculate random spin
      const spinDegrees = 3600 + Math.floor(Math.random() * 360)
      wheel.style.transform = `rotate(${spinDegrees}deg)`
  
      setTimeout(() => {
        if (currentMode === "prize") {
          // Calculate which prize was selected
          const actualRotation = spinDegrees % 360
          const segmentAngle = 360 / prizes.length
          const selectedIndex = Math.floor(prizes.length - actualRotation / segmentAngle)
          const normalizedIndex = selectedIndex % prizes.length
  
          selectedPrize = prizes[normalizedIndex]
  
          // Show winner after a delay
          setTimeout(() => {
            showWinner(selectedPrize, "prize")
            isSpinning = false
            spinBtn.disabled = false
            spinBtn.textContent = "SPIN THE WHEEL"
          }, 500)
        } else {
          // Generate random number
          const randomNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber
  
          // Show winner after a delay
          setTimeout(() => {
            showWinner(randomNumber, "number")
            resultNumber.textContent = randomNumber
            addToHistory(randomNumber)
            isSpinning = false
            spinBtn.disabled = false
            spinBtn.textContent = "SPIN THE WHEEL"
          }, 500)
        }
      }, 5000) // Wait for the spin animation to complete
    }
  
    // Add number to history
    function addToHistory(number) {
      // Add to beginning of array
      history.unshift(number)
  
      // Keep only the last 20 numbers
      if (history.length > 20) {
        history.pop()
      }
  
      // Update history display
      updateHistoryDisplay()
    }
  
    // Update history display
    function updateHistoryDisplay() {
      // Clear history display
      numberHistory.innerHTML = ""
  
      if (history.length === 0) {
        const emptyMessage = document.createElement("p")
        emptyMessage.className = "empty-history"
        emptyMessage.textContent = "No numbers yet. Spin the wheel!"
        numberHistory.appendChild(emptyMessage)
        return
      }
  
      // Add each number to history display
      history.forEach((number) => {
        const historyItem = document.createElement("div")
        historyItem.className = "history-item"
        historyItem.textContent = number
        numberHistory.appendChild(historyItem)
      })
    }
  
    // Show winner modal and create confetti
    function showWinner(winner, type) {
      if (type === "prize") {
        winnerText.textContent = "The winner is:"
      } else {
        winnerText.textContent = "The lucky number is:"
      }
  
      winnerDisplay.textContent = winner
      winnerModal.style.display = "flex"
  
      // Play win sound
      const winSound = new Audio("https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3")
      winSound.volume = 0.7
      winSound.play()
  
      // Create confetti
      createConfetti()
    }
  
    // Create confetti effect
    function createConfetti() {
      const confettiCount = 200
      const confetti = []
  
      // Confetti colors - ocean theme
      const confettiColors = [
        "#7fdbff", // Light Blue
        "#00cccc", // Teal
        "#ff7f50", // Coral
        "#f5deb3", // Sand
        "#006994", // Deep Blue
        "#00ffff", // Cyan
        "#ffffff", // White
        "#66cccc", // Seafoam
      ]
  
      // Create confetti particles
      for (let i = 0; i < confettiCount; i++) {
        confetti.push({
          x: Math.random() * confettiCanvas.width,
          y: -20,
          size: Math.random() * 10 + 5,
          color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
          speed: Math.random() * 3 + 2,
          angle: Math.random() * 6.28,
          rotation: Math.random() * 0.2 - 0.1,
          rotationSpeed: Math.random() * 0.01,
        })
      }
  
      // Animate confetti
      function animateConfetti() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height)
  
        let stillFalling = false
  
        confetti.forEach((particle) => {
          particle.y += particle.speed
          particle.x += Math.sin(particle.angle) * 2
          particle.angle += particle.rotation
          particle.rotation += particle.rotationSpeed
  
          ctx.save()
          ctx.translate(particle.x, particle.y)
          ctx.rotate(particle.angle)
          ctx.fillStyle = particle.color
          ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)
          ctx.restore()
  
          if (particle.y < confettiCanvas.height) {
            stillFalling = true
          }
        })
  
        if (stillFalling && winnerModal.style.display === "flex") {
          requestAnimationFrame(animateConfetti)
        } else {
          ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height)
        }
      }
  
      animateConfetti()
    }
  
    // Switch between prize and number modes
    function switchMode(mode) {
      currentMode = mode
  
      if (mode === "prize") {
        prizeModeBtn.classList.add("active")
        numberModeBtn.classList.remove("active")
        prizeControls.classList.remove("hidden")
        numberControls.classList.add("hidden")
      } else {
        prizeModeBtn.classList.remove("active")
        numberModeBtn.classList.add("active")
        prizeControls.classList.add("hidden")
        numberControls.classList.remove("hidden")
      }
  
      initWheel()
    }
  
    // Event Listeners
    spinBtn.addEventListener("click", spinWheel)
  
    addPrizeBtn.addEventListener("click", () => {
      const prize = prizeInput.value.trim()
      if (prize) {
        prizes.push(prize)
        initWheel()
        initPrizeList()
        prizeInput.value = ""
      }
    })
  
    prizeInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        addPrizeBtn.click()
      }
    })
  
    prizeModeBtn.addEventListener("click", () => {
      switchMode("prize")
    })
  
    numberModeBtn.addEventListener("click", () => {
      switchMode("number")
    })
  
    updateRangeBtn.addEventListener("click", updateRange)
  
    closeModal.addEventListener("click", () => {
      winnerModal.style.display = "none"
    })
  
    window.addEventListener("resize", () => {
      confettiCanvas.width = window.innerWidth
      confettiCanvas.height = window.innerHeight
    })
  
    // Initialize the wheel and prize list
    initWheel()
    initPrizeList()
    updateHistoryDisplay()
  
    // Add ocean-themed animations
    function addBubbleAnimation() {
      const bubbles = document.querySelectorAll(".bubble")
  
      bubbles.forEach((bubble) => {
        const delay = Math.random() * 5
        const duration = Math.random() * 5 + 5
  
        bubble.style.animationDelay = `${delay}s`
        bubble.style.animationDuration = `${duration}s`
      })
    }
  
    addBubbleAnimation()
  
    // Add keyboard support
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        if (!isSpinning && document.activeElement !== minNumberInput && document.activeElement !== maxNumberInput) {
          spinWheel()
        }
      }
    })
  
    // Add treasure map background animation
    function addTreasureMapAnimation() {
      const mapElements = document.querySelectorAll(".treasure-map-element")
  
      mapElements.forEach((element) => {
        const randomDelay = Math.random() * 5
        element.style.animation = `pulse 3s infinite ${randomDelay}s`
      })
    }
  
    // Add some pirate-themed easter eggs
    const pirateQuotes = [
      "Ahoy! Ye found treasure number ",
      "Shiver me timbers! It's number ",
      "Yo ho ho! The lucky number be ",
      "Avast ye! Treasure chest number ",
      "Arr! X marks the spot at number ",
    ]
  
    function getPirateQuote(number) {
      const randomIndex = Math.floor(Math.random() * pirateQuotes.length)
      return pirateQuotes[randomIndex] + number + "!"
    }
  
    // Update modal text with pirate quote
    function updateModalWithPirateQuote(number) {
      const modalTitle = document.querySelector(".modal-content h2")
      modalTitle.textContent = getPirateQuote(number)
    }
  
    // Override showWinner to include pirate quotes
    const originalShowWinner = showWinner
    showWinner = (number) => {
      originalShowWinner(number)
      updateModalWithPirateQuote(number)
    }
  })
  