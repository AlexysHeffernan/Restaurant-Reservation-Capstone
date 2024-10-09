function ReservationErrors({ errors }) {
    if (errors !== null ) {
        if (errors.length) {
            return(
                <div className="alert alert-danger">
                    <p>Error:</p>
                    {errors.map((error) => (
                        <p key={errors.indexOf(error)}>{error.message}</p>
                    ))}
                </div>
            );
        }
    }
    return null;
}

export default ReservationErrors;