package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"sort"
	"strconv"
	"sync"
	"time"
)

type TwitchResponse struct {
	Stream struct {
		ID          *int       `json:"id"`
		Game        *string    `json:"game"`
		Viewers     *int       `json:"viewers"`
		VideoHeight *int       `json:"videoheight"`
		AverageFps  *int       `json:"averggefps"`
		Delay       *int       `json:"delay"`
		CreatedAt   *time.Time `json:"createdAt"`
		IsPlaylist  *bool      `json:"isPlaylist"`
		Preview     struct {
			Small    *string `json:"small"`
			Medium   *string `json:"medium"`
			Large    *string `json:"large"`
			Template *string `json:"template"`
		}
		Channel struct {
			Mature                       bool        `json:"mature"`
			Status                       *string     `json:"status"`
			BroadcasterLanguage          string      `json:"broadcaster_language"`
			DisplayName                  string      `json:"display_name"`
			Game                         string      `json:"game"`
			Language                     string      `json:"language"`
			ID                           int         `json:"_id"`
			Name                         string      `json:"name"`
			CreatedAt                    time.Time   `json:"created_at"`
			UpdatedAt                    time.Time   `json:"updated_at"`
			Partner                      bool        `json:"partner"`
			Logo                         string      `json:"logo"`
			VideoBanner                  string      `json:"video_banner"`
			ProfileBanner                string      `json:"profile_banner"`
			ProfileBannerBackgroundColor interface{} `json:"profile_banner_background_color"`
			URL                          string      `json:"url"`
			Views                        int         `json:"views"`
			Followers                    int         `json:"followers"`
		} `json:"channel"`
	} `json:"stream"`
}

type Newlive struct {
	Name        *string    `json:"name"`
	ImageID     *string    `json:"imageId"`
	ChannelID   *string    `json:"channelId"`
	Title       *string    `json:"title"`
	Description *string    `json:"description,omitempty"`
	Viewers     *int       `json:"viewers"`
	Likes       *string    `json:"likes,omitempty"`
	Dislikes    *string    `json:"dislikes,omitempty"`
	VideoID     *string    `json:"videoId, omitempty"`
	Thumbnail   Thumbnails `json:"thumbnails"`
	DisplayName *string    `json:"displayName,omitempty"`
	IsPlaying   *string    `json:"isPlaying,omitempty"`
	Mature      *bool      `json:"mature, omitempty"`
	Type        string     `json:"type"`
}

// []string{"hasanabi", "destiny", "invadervie", "richardlewisreports", "hitch", "cjayride", "trainwreckstv"}
var streamers = []Streamer{
	{Name: "Ice Poseidon", ChannelId: "UCv9Edl_WbtbPeURPtFDo-uA", ImageID: "ice.jpg", Type: "youtube"},
	{Name: "Hyphonix", ChannelId: "UCaFpm67qMk1W1wJkFhGXucA", ImageID: "hyphonix.jpg", Type: "youtube"},
	{Name: "Gary", ChannelId: "UCvxSwu13u1wWyROPlCH-MZg", ImageID: "gary.jpg", Type: "youtube"},
	{Name: "Cxnews", ChannelId: "UCStEQ9BjMLjHTHLNA6cY9vg", ImageID: "cxnews.jpg", Type: "youtube"},
	{Name: "Voldesad", ChannelId: "UCPkOhci8gkwL7p6hxIJ2WQw", ImageID: "vold.jpg", Type: "youtube"},
	{Name: "Cassandra", ChannelId: "UCoQnCN55E25nGavk79Asyng", ImageID: "cass.jpg", Type: "youtube"},
	{Name: "Juan Bagnell", ChannelId: "UCvhnYODy6WQ0mw_zi3V1h0g", ImageID: "juan.jpg", Type: "youtube"},
	{Name: "Coding Train", ChannelId: "UCvjgXvBlbQiydffZU7m1_aw", ImageID: "coding.jpg", Type: "youtube"},
	{Name: "Joe Rogan Podcast", ChannelId: "UCzQUP1qoWDoEbmsQxvdjxgQ", ImageID: "joe.jpg", Type: "youtube"},
	{Name: "Mixhound", ChannelId: "UC_jxnWLGJ2eQK4en3UblKEw", ImageID: "mix.jpg", Type: "youtube"},
	{Name: "Hasanabi", Type: "twitch", ImageID: "hasanabi.jpeg"},
	{Name: "Destiny", Type: "twitch", ImageID: "destiny.jpg"},
	{Name: "Invadervie", Type: "twitch", ImageID: "invadervie.jpg"},
	{Name: "Richardlewisreports", Type: "twitch", ImageID: "richardlewis.jpeg"},
	{Name: "Cjayride", Type: "twitch", ImageID: "cjayride.jpg"},
	{Name: "Hitch", Type: "twitch", ImageID: "hitch.jpg"},
	{Name: "Rajjpatel", Type: "twitch", ImageID: "rajjpatel.jpg"},
	{Name: "TrainwrecksTv", Type: "twitch", ImageID: "trainwreckstv.jpg"},
	{Name: "GreekGodx", Type: "twitch", ImageID: "greekgodx.jpeg"},
	{Name: "EsfandTV", Type: "twitch", ImageID: "esfandtv.jpeg"},
	{Name: "Alecludford", Type: "twitch", ImageID: "alecludford.jpeg"},
}
var payload = make(chan Newlive)
var done = make(chan bool)

var waiter sync.WaitGroup

func (s Streamer) getData() {
	defer waiter.Done()
	if s.Type == "youtube" {
		url := fmt.Sprintf("https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=%v&eventType=live&type=video&key=%v", s.ChannelId, os.Getenv("KEY"))
		resp, err := http.Get(url)
		if err != nil || resp.StatusCode != 200 {
			fmt.Println("youtube req erro")
			fmt.Println(resp)
			return
		}
		defer resp.Body.Close()
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			fmt.Println(err)
		}
		var streamer Islive
		json.Unmarshal(body, &streamer)
		if streamer.PageInfo.TotalResults == 0 {
			return
		}
		streamer.Name = s.Name
		streamer.ImageID = s.ImageID

		id := streamer.Items[0].ID.VideoID
		resp, err = http.Get("https://www.googleapis.com/youtube/v3/videos?part=statistics%2C+snippet%2C+liveStreamingDetails&id=" + id + "&key=" + mykey)
		if err != nil || resp.StatusCode != 200 {
			fmt.Println(err)
			return
		}
		body, err = ioutil.ReadAll(resp.Body)
		if err != nil {
			fmt.Println(err)
		}
		defer resp.Body.Close()
		var live Livestream
		json.Unmarshal(body, &live)
		name, err := strconv.Atoi(live.Items[0].LiveStreamingDetails.ConcurrentViewers)
		if err != nil {
			fmt.Println(err)
			return
		}
		thumb := Thumbnails{High: live.Items[0].Snippet.Thumbnails.Maxres.URL, Low: live.Items[0].Snippet.Thumbnails.High.URL}
		rz := Newlive{
			Name:        &streamer.Name,
			ImageID:     &streamer.ImageID,
			ChannelID:   &live.Items[0].Snippet.ChannelID,
			Title:       &live.Items[0].Snippet.Title,
			Description: &live.Items[0].Snippet.Description,
			Viewers:     &name,
			Likes:       &live.Items[0].Statistics.LikeCount,
			Dislikes:    &live.Items[0].Statistics.DislikeCount,
			VideoID:     &live.Items[0].ID,
			Thumbnail:   thumb,
			Type:        "youtube",
		}
		payload <- rz
	} else if s.Type == "twitch" {
		url := fmt.Sprintf("https://api.twitch.tv/kraken/streams/%v?client_id=%v", s.Name, os.Getenv("TWITCH"))
		rz, err := http.Get(url)
		if err != nil {
			fmt.Println(err)
		}
		body, err := ioutil.ReadAll(rz.Body)
		defer rz.Body.Close()
		var res TwitchResponse
		json.Unmarshal(body, &res)
		if res.Stream.Channel.Status == nil {
			return
		}
		thumb := Thumbnails{High: *res.Stream.Preview.Large, Low: *res.Stream.Preview.Medium}
		result := Newlive{
			ChannelID:   &res.Stream.Channel.Name,
			Name:        &res.Stream.Channel.Name,
			ImageID:     &res.Stream.Channel.Logo,
			VideoID:     &res.Stream.Channel.Name,
			Title:       res.Stream.Channel.Status,
			Viewers:     res.Stream.Viewers,
			Thumbnail:   thumb,
			DisplayName: &res.Stream.Channel.DisplayName,
			IsPlaying:   res.Stream.Game,
			Mature:      &res.Stream.Channel.Mature,
			Type:        "twitch",
		}
		payload <- result
	}
}

var counter int

func Waitme() {
	waiter.Add(len(streamers))
	for _, s := range streamers {
		go s.getData()
	}
	waiter.Wait()
	if counter == 1 {
		title, name, typ, imageid, viewers := "a title", "a random name", "twitch", "123132", 1337
		tst := Newlive{Title: &title, Name: &name, Type: typ, ImageID: &imageid, Viewers: &viewers}

		payload <- tst
	}
	counter++
	done <- true
}
func Listener() {
	final := []Newlive{}
	for {
		select {
		case request := <-payload:
			final = append(final, request)
		case isDone := <-done:
			if isDone {
				fmt.Println("done ran")
				Results = final
				sort.Sort(ByViewers(Results))
				final = nil
			}
		}
	}
}
