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

var streamers = []Streamer{
	{Name: "Ice Poseidon", ChannelId: "UCv9Edl_WbtbPeURPtFDo-uA", ImageID: "ice"},
	{Name: "Hyphonix", ChannelId: "UCaFpm67qMk1W1wJkFhGXucA", ImageID: "hyphonix"},
	{Name: "Gary", ChannelId: "UCvxSwu13u1wWyROPlCH-MZg", ImageID: "gary"},
	{Name: "Cxnews", ChannelId: "UCStEQ9BjMLjHTHLNA6cY9vg", ImageID: "cxnews"},
	{Name: "Andy", ChannelId: "UC8EmlqXIlJJpF7dTOmSywBg", ImageID: "mexican"},
	{Name: "Voldesad", ChannelId: "UCPkOhci8gkwL7p6hxIJ2WQw", ImageID: "vold"},
	{Name: "Cassandra", ChannelId: "UCoQnCN55E25nGavk79Asyng", ImageID: "cass"},
	{Name: "Juan Bagnell", ChannelId: "UCvhnYODy6WQ0mw_zi3V1h0g", ImageID: "juan"},
	{Name: "Coding Train", ChannelId: "UCvjgXvBlbQiydffZU7m1_aw", ImageID: "coding"},
	{Name: "Ethan & Hila", ChannelId: "UC7pp40MU_6rLK5pvJYG3d0Q", ImageID: "ethan"},
	{Name: "Joe Rogan Podcast", ChannelId: "UCzQUP1qoWDoEbmsQxvdjxgQ", ImageID: "joe"},
	{Name: "Mixhound", ChannelId: "UC_jxnWLGJ2eQK4en3UblKEw", ImageID: "mix"},
}

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
	go GetYoutube()
	go func() {
		pollInterval := 10

		timerCh := time.Tick(time.Duration(pollInterval) * time.Minute)

		for range timerCh {
			go GetYoutube()
		}
	}()
	hub := newHub()
	go hub.run()

	http.HandleFunc("/youtube/all", getCatalog)
	http.HandleFunc("/youtube/live", sendStuff)
	http.HandleFunc("/sockets/", func(w http.ResponseWriter, r *http.Request) {
		SocketMe(hub, w, r)
	})

	log.Fatal(http.ListenAndServe(":"+os.Getenv("PORT"), nil))
}
