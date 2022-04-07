import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'

import { loadStripe } from '@stripe/stripe-js'

import toast, { Toaster } from 'react-hot-toast'
import { ResponsiveLine } from '@nivo/line'

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)

function Dash() {
    const [data, setData] = useState([])
    const [median, setMedian] = useState(0)
    const [pounds, setPounds] = useState(0)
    const [rate, setRate] = useState(2) // TODO: connect to API

    const user = useSelector((state) => state.user)

    useEffect(() => {
        const getDeviceData = async (id) => {
            const dataRes = await axios.get(`/api/devices/${id}`)
            const d = dataRes.data
            return d.data.map((data) => ({
                x: new Date(data.updatedAt),
                y: data.point,
            }))
        }
        // get data
        const getData = async () => {
            const devicesRes = await axios.get('/api/devices')
            const devices = devicesRes.data.data
            // parse data
            const parsedData = await Promise.all(
                devices.map(async (device) => {
                    return {
                        id: device._id,
                        data: await getDeviceData(device._id),
                    }
                })
            )

            const medianRes = await axios.get('/api/devices/median')
            const { median } = medianRes.data.data
            setMedian(median)

            const pounds = parsedData.reduce(
                (acc, curr) => (acc += curr.data[0].y),
                0
            )

            setPounds(pounds)
            setData(parsedData)
        }

        getData()
        const query = new URLSearchParams(window.location.search)
        if (query.get('success')) {
            toast.success(
                'You paid your waste bill! Thanks for contributing to a zero-waste tomorrow.'
            )
        }
        if (query.get('canceled')) {
            toast.error('Payment canceled.')
        }
    }, [])

    const pay = async () => {
        const stripe = await stripePromise
        const response = await axios.post('/api/users/pay')
        const session = response.data
        // When the customer clicks on the button, redirect them to Checkout.
        const result = await stripe.redirectToCheckout({
            sessionId: session.id,
        })
    }

    const percentage =
        Math.round(((pounds - median) / median) * 100 * 100) / 100 || 0
    let sign = ''
    if (percentage > 0) sign = '+'
    else if (percentage < 0) sign = '-'

    return (
        <>
            <Toaster />
            <div className="primary py-5">
                <div className="container text-center">
                    <h4>Your waste this week</h4>
                    <div className="row mt-5">
                        <div className="col-md-4">
                            <h2 className="text-center">
                                {sign}
                                {percentage}%
                            </h2>
                            <p>
                                {percentage > 0 ? 'more' : 'less'} than the
                                median
                            </p>
                        </div>
                        <div className="col-md-4">
                            <h2 className="text-center">${pounds * rate}</h2>
                            <p>waste bill</p>
                            <button
                                className="btn btn-link p-=0"
                                style={{ marginTop: '-25px' }}
                                onClick={pay}
                            >
                                pay now
                            </button>
                        </div>
                        <div className="col-md-4">
                            <h2 className="text-center">{pounds}</h2>
                            <p>lbs of waste</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container py-5">
                <h2>Consumption</h2>
                <p>View your waste history</p>
                <div
                    style={{
                        height: '500px',
                        marginTop: '25px',
                        padding: '25px',
                        background: 'rgba(196, 196, 196, 0.1)',
                    }}
                >
                    <LineGraph data={data} />
                </div>
            </div>
            <div className="container py-3">
                <h2>Resources</h2>
                <p>Learn how to go zero-waste</p>
            </div>
        </>
    )
}

const LineGraph = ({ data }) => (
    <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{
            type: 'time',
            format: 'native',
            precision: 'minute',
        }}
        yScale={{
            type: 'linear',
            min: '0',
            max: 'auto',
            stacked: true,
            reverse: false,
        }}
        xFormat="time:%Y-%m-%d"
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            format: '%b %d',
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Date',
            legendOffset: 36,
            legendPosition: 'middle',
            tickValues: 5,
        }}
        axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Weight (pounds)',
            legendOffset: -40,
            legendPosition: 'middle',
        }}
        pointSize={10}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1,
                        },
                    },
                ],
            },
        ]}
    />
)
export default Dash
