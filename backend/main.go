package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"runtime"
	"sync"
	"time"

	"github.com/joho/godotenv"
	fisheryates "github.com/matttproud/fisheryates"
)

var Results []Newlive
var wg sync.WaitGroup
var mykey string

func getCatalog(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json")
	rnd := rand.New(rand.NewSource(4))
	fisheryates.Shuffle(Random(streamers), rnd.Intn)
	b, err := json.Marshal(streamers)
	if err != nil {
		fmt.Println(err)
	}
	w.Write(b)
}

func sendStuff(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json")
	b, err := json.Marshal(Results)
	if err != nil {
		fmt.Println(err)
	}
	w.Write(b)
}

func init() {
	fmt.Println(runtime.NumCPU())
	ky := &mykey
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	*ky = os.Getenv("KEY")
}

func main() {
	fmt.Println("Server Started...")
	go Listener()
	go Waitme()
	go func() {
		pollInterval := 5

		timerCh := time.Tick(time.Duration(pollInterval) * time.Minute)
		for range timerCh {
			go Waitme()
		}
	}()
	hub := newHub()
	go hub.run()

	http.HandleFunc("/streamers/all", getCatalog)
	http.HandleFunc("/streamers/live", sendStuff)
	http.HandleFunc("/sockets/", func(w http.ResponseWriter, r *http.Request) {
		return
		//	SocketMe(hub, w, r)
	})

	log.Fatal(http.ListenAndServe(":"+os.Getenv("PORT"), nil))
}
