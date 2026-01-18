import AppLayout from "@/components/layout/AppLayout";

const ExampleComponent = () =>{

    return(
        <div>
            <div>I am ironman</div>
            <div>i am burning with glorious purpose</div>
        </div>
    )
}

export default AppLayout()(ExampleComponent);