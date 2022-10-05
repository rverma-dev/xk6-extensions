package mongo

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"go.k6.io/k6/js/common"
	"go.k6.io/k6/js/modules"
)

// init is called by the Go runtime at application startup.
func init() {
	modules.Register("k6/x/mongo", new(RootModule))
}

type (
	// RootModule is the global module instance that will create module instances for each VU
	RootModule struct{}

	// Mongo represents an instance of the JS module
	Mongo struct {
		// vu provides methods for accessing internal k6 objects for a VU
		vu modules.VU
	}
)

var (
	_ modules.Module   = &RootModule{}
	_ modules.Instance = &Mongo{}
)

// NewModuleInstance implements the modules.Module interface returning a new instance for each VU.
func (m *RootModule) NewModuleInstance(vu modules.VU) modules.Instance {
	return &Mongo{vu: vu}
}

func (m *Mongo) Exports() modules.Exports {
	return modules.Exports{Default: m}
}

// XClient represents the Client constructor (i.e. `new mongo.Client()`) and
// returns a new Mongo client object.
// connURI -> mongodb://username:password@address:port/db?connect=direct
func (m *Mongo) XClient(connURI string) (*mongo.Client, error) {
	rt := m.vu.Runtime()
	if connURI == "" {
		common.Throw(rt, fmt.Errorf("url is required"))
	}
	clientOptions := options.Client().ApplyURI(connURI)
	return mongo.Connect(context.TODO(), clientOptions)
}

func (*Mongo) Insert(c *mongo.Client, database string, collection string, doc map[string]string) error {
	db := c.Database(database)
	col := db.Collection(collection)
	_, err := col.InsertOne(context.TODO(), doc)
	if err != nil {
		return err
	}
	return nil
}
