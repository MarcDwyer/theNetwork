package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"runtime"
	"sync"
	"time"

	"github.com/joho/godotenv"
)

var Results []Newlive
var wg sync.WaitGroup
var mykey string

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
	hub := newHub()
	go hub.run()
	go Listener(hub)
	go getStreamData()
	go func() {
		pollInterval := 4

		timerCh := time.Tick(time.Duration(pollInterval) * time.Minute)
		for range timerCh {
			go getStreamData()
		}
	}()
	http.HandleFunc("/sockets/", func(w http.ResponseWriter, r *http.Request) {
		SocketMe(hub, w, r)
	})

	log.Fatal(http.ListenAndServe(":"+os.Getenv("PORT"), nil))
}
