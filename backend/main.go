package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"os"
	"runtime"
	"sort"
	"strconv"
	"sync"
	"time"

	"github.com/joho/godotenv"
	fisheryates "github.com/matttproud/fisheryates"
)

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
}
var resp []Newlive

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
	b, err := json.Marshal(resp)
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
	go getter()

	go func() {
		pollInterval := 10

		timerCh := time.Tick(time.Duration(pollInterval) * time.Minute)

		for range timerCh {
			getter()
		}
	}()
	hub := newHub()
	go hub.run()

	http.HandleFunc("/streamers/all", getCatalog)
	http.HandleFunc("/streamers/live", sendStuff)
	http.HandleFunc("/sockets/", func(w http.ResponseWriter, r *http.Request) {
		SocketMe(hub, w, r)
	})

	log.Fatal(http.ListenAndServe(":"+os.Getenv("PORT"), nil))
}

var numb int

func getter() {
	fmt.Println("getting....")
	ch := make(chan *Islive)
	go func() {
		defer close(ch)
		for _, v := range streamers {
			url := fmt.Sprintf("https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=%v&eventType=live&type=video&key=%v", v.ChannelId, mykey)
			resp, err := http.Get(url)
			if err != nil || resp.StatusCode != 200 {
				fmt.Println(err)
				continue
			}
			body, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				fmt.Println(err)
			}
			var streamer Islive
			json.Unmarshal(body, &streamer)
			if streamer.PageInfo.TotalResults == 0 {
				continue
			}
			streamer.Name = v.Name
			streamer.ImageID = v.ImageID
			ch <- &streamer
		}
	}()
	go func() {
		final := new([]Newlive)
		for v := range ch {
			if v == nil {
				fmt.Println("nil value")
				continue
			}
			id := v.Items[0].ID.VideoID
			resp, err := http.Get("https://www.googleapis.com/youtube/v3/videos?part=statistics%2C+snippet%2C+liveStreamingDetails&id=" + id + "&key=" + mykey)
			if err != nil || resp.StatusCode != 200 {
				fmt.Println(err)
				continue
			}
			body, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				fmt.Println(err)
			}
			var live Livestream
			json.Unmarshal(body, &live)
			name, err := strconv.Atoi(live.Items[0].LiveStreamingDetails.ConcurrentViewers)
			if err != nil {
				fmt.Println(name)
				fmt.Println(err)
				continue
			}
			rz := Newlive{
				Name:        v.Name,
				ImageID:     v.ImageID,
				ChannelID:   live.Items[0].Snippet.ChannelID,
				Title:       live.Items[0].Snippet.Title,
				Description: live.Items[0].Snippet.Description,
				Viewers:     name,
				Likes:       live.Items[0].Statistics.LikeCount,
				Dislikes:    live.Items[0].Statistics.DislikeCount,
				VideoID:     live.Items[0].ID,
				Thumbnail:   live.Items[0].Snippet.Thumbnails,
			}
			if numb == 1 {
				tester := Newlive{
					Name:        "test",
					ImageID:     v.ImageID,
					ChannelID:   "sasdqawdqwd123123131",
					Title:       "test",
					Description: "test",
					Viewers:     1337,
					Likes:       "1337",
					Dislikes:    "0",
					VideoID:     "test",
					Thumbnail:   live.Items[0].Snippet.Thumbnails,
				}
				tester2 := Newlive{
					Name:        "test2",
					ImageID:     v.ImageID,
					ChannelID:   "qwdascascsa121231231",
					Title:       "test",
					Description: "test",
					Viewers:     1337,
					Likes:       "1337",
					Dislikes:    "0",
					VideoID:     "test",
					Thumbnail:   live.Items[0].Snippet.Thumbnails,
				}
				*final = append(*final, tester)
				*final = append(*final, tester2)
			}
			*final = append(*final, rz)
		}
		numb++
		resp = *final
		sort.Sort(ByViewers(resp))
	}()
}
