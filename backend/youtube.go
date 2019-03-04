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
	Description *string    `json:"description"`
	Viewers     *int       `json:"viewers"`
	Likes       *string    `json:"likes"`
	Dislikes    *string    `json:"dislikes"`
	VideoID     *string    `json:"videoId"`
	Thumbnail   Thumbnails `json:"thumbnails"`
	Type        string     `json:"type"`
}

func GetYoutube() {
	fmt.Println("getting....")
	final := []Newlive{}
	ch := make(chan *Islive)
	var fetchWait sync.WaitGroup
	fetchWait.Add(1)
	go func() {
		defer close(ch)
		for _, v := range streamers {
			url := fmt.Sprintf("https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=%v&eventType=live&type=video&key=%v", v.ChannelId, mykey)
			resp, err := http.Get(url)
			if err != nil || resp.StatusCode != 200 {
				fmt.Println(err)
				continue
			}
			defer resp.Body.Close()
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
		if ch == nil {
			return
		}
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
			defer resp.Body.Close()
			var live Livestream
			json.Unmarshal(body, &live)
			name, err := strconv.Atoi(live.Items[0].LiveStreamingDetails.ConcurrentViewers)
			if err != nil {
				fmt.Println(name)
				fmt.Println(err)
				continue
			}
			thumb := Thumbnails{High: live.Items[0].Snippet.Thumbnails.Maxres.URL, Low: live.Items[0].Snippet.Thumbnails.High.URL}
			rz := Newlive{
				Name:        &v.Name,
				ImageID:     &v.ImageID,
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
			final = append(final, rz)
		}
		fetchWait.Done()
	}()
	go func() {
		fetchWait.Wait()
		defer func() {
			sort.Sort(ByViewers(final))
			Results = final
		}()
		list := []string{"hasanabi", "destiny", "invadervie", "richardlewisreports", "hitch", "cjayride", "trainwreckstv"}
		pushthis := []Newlive{}
		for _, v := range list {
			fmt.Println("pooper")
			url := fmt.Sprintf("https://api.twitch.tv/kraken/streams/%v?client_id=%v", v, os.Getenv("TWITCH"))

			rz, err := http.Get(url)
			if err != nil {
				fmt.Println(err)
			}
			body, err := ioutil.ReadAll(rz.Body)
			defer rz.Body.Close()
			var res TwitchResponse
			err = json.Unmarshal(body, &res)
			if err != nil {
				fmt.Println(err)
			}
			if res.Stream.Channel.Status == nil {
				continue
			}
			thumb := Thumbnails{High: *res.Stream.Preview.Large, Low: *res.Stream.Preview.Medium}
			result := Newlive{
				Name:      &res.Stream.Channel.Name,
				ImageID:   &res.Stream.Channel.Logo,
				VideoID:   &res.Stream.Channel.Name,
				Title:     res.Stream.Channel.Status,
				Viewers:   res.Stream.Viewers,
				Thumbnail: thumb,
				Type:      "twitch",
			}
			pushthis = append(pushthis, result)
		}
		for _, x := range pushthis {
			final = append(final, x)
		}
	}()
}
