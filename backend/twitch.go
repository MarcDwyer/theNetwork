package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"
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

type Twitch struct {
	Name      string
	Viewers   int
	ImageID   string
	Title     string
	Thumbnail string
	VideoId   string
}

func GetTwitch() {
	fmt.Println("poop")

	list := []string{"hasanabi", "destiny", "invadervie", "", "hitch", "cjayride", "trainwreckstv"}
	for _, v := range list {
		url := fmt.Sprintf("https://api.twitch.tv/kraken/streams/%v?client_id=%v", v, os.Getenv("CLIENT"))

		rz, err := http.Get(url)
		if err != nil {
			fmt.Println(err)
		}
		body, err := ioutil.ReadAll(rz.Body)

		var res TwitchResponse
		json.Unmarshal(body, &res)
		if res.Stream.Channel.Status == nil {
			continue
		}

		rez := Twitch{
			Name:    res.Stream.Channel.Name,
			ImageID: res.Stream.Channel.Name,
			VideoId: strconv.Itoa(*res.Stream.ID),
			Title:   *res.Stream.Channel.Status,
			Viewers: *res.Stream.Viewers,
		}
		//	final = append(final, rz)
		fmt.Println(rez)
	}
}
