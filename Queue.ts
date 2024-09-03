interface IQueue<T>
{
public:
	/// Type definition of the type.
	IQueue<T>();
	IQueue<T>(size: number);
	constructor(queueToCopy: Queue<T>);
	constructor(storageArray: Array<T>);



    Assign(rhs: IQueue<T>): IQueue<T>; 
	Enqueue(element: T);
	Dequeue() : T;
	Clear();


	First() : T;
	Last() : T;
	GetIterator() : Queue_Iterator<T>;

protected:
	// Overridden abstract methods from base class
	virtual void IncreaseCapacity(void);
	virtual int IndexOf_NewestElement(void) const override;
	virtual int IndexOf_OldestElement(void) const override;
	
	int GetNextSpot(int currentSpot) const;

	int first_;
	int last_;

	//template <typename T> friend class Queue_Iterator;
	//template <typename T> friend class Queue_ReverseIterator;
};


interface IQueue<T>
{
    private storage: Array<T>; 
    private first: number;
    private last: number;
    private size: number;

    constructor(private capacity: number);


}

class Queue<T> implements IQueue<T>
{
    constructor(private capacity: number)
    {
        capacity = (capacity < 5) ? 25 : capacity;

        function Enqueue(element: T): void
        {
            var nextPosition = this.last + 1;
            if (nextPosition >= capacity)
            {
                capacity *= 2;
                var oldSize = this.storage.size();
                var temp = Array<T>(capacity);

                for (var i; i < oldSize; i++)
                {
                    temp[i] = this.storage[i];
                }
                this.storage = temp; 
            }

            this.last++;
            this.storage[this.last] = element;
            this.size++;
        }

        
    }


}