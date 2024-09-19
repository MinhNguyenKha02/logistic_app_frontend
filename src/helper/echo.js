import Echo from "laravel-echo";

export const echo = (token) => {
  return new Echo({
    authEndpoint:'http://127.0.0.1:8000/broadcasting/auth',
    broadcaster: 'pusher',
    key: 'ad8269313808491580a8',
    cluster: 'ap1',
    forceTLS: true,
    auth: {
      headers: {
        Authorization: 'Bearer ' +  token
      },
    },
  })
}